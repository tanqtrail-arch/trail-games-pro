import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Stripe & Supabase クライアント初期化
// ---------------------------------------------------------------------------

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ---------------------------------------------------------------------------
// ヘルパー関数
// ---------------------------------------------------------------------------

/**
 * Stripe の customer ID からユーザーを検索し、plan_type を更新する。
 * @param customerId - Stripe の顧客ID
 * @param planType - 更新先のプランタイプ（'free' | 'paid'）
 */
async function updateUserPlan(
  customerId: string,
  planType: "free" | "paid"
): Promise<void> {
  const supabase = getSupabase();
  // まず stripe_customer_id カラムで検索
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (fetchError || !user) {
    console.error(
      `ユーザーが見つかりません (stripe_customer_id: ${customerId}):`,
      fetchError?.message
    );
    return;
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({ plan_type: planType })
    .eq("id", user.id);

  if (updateError) {
    console.error(
      `plan_type の更新に失敗しました (user_id: ${user.id}):`,
      updateError.message
    );
  }
}

/**
 * Stripe サブスクリプションのステータスに応じたプランタイプを返す。
 * @param status - Stripe のサブスクリプションステータス
 * @returns 'paid' | 'free'
 */
function planTypeFromStatus(status: Stripe.Subscription.Status): "paid" | "free" {
  const activePlans: Stripe.Subscription.Status[] = [
    "active",
    "trialing",
  ];
  return activePlans.includes(status) ? "paid" : "free";
}

// ---------------------------------------------------------------------------
// POST /api/webhooks/stripe
// Stripe Webhook ハンドラー
// ---------------------------------------------------------------------------

/**
 * Stripe Webhook エンドポイント
 *
 * 処理するイベント:
 * - customer.subscription.created: ユーザーのプランを 'paid' に更新
 * - customer.subscription.deleted: ユーザーのプランを 'free' に更新
 * - customer.subscription.updated: サブスクリプション変更を反映
 * - invoice.payment_succeeded: 決済成功をログ記録
 * - invoice.payment_failed: 決済失敗をフラグ付け
 */
export async function POST(request: Request) {
  let event: Stripe.Event;
  const supabase = getSupabase();

  try {
    // Stripe の署名検証にはリクエストの生テキストが必要
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("Stripe 署名ヘッダーがありません");
      return NextResponse.json(
        { error: "stripe-signature ヘッダーが必要です" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "署名検証に失敗しました";
    console.error(`Webhook 署名検証エラー: ${message}`);
    return NextResponse.json(
      { error: `Webhook 署名検証エラー: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      // -----------------------------------------------------------------
      // サブスクリプション作成 → 有料プランに変更
      // -----------------------------------------------------------------
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        console.log(
          `[Webhook] サブスクリプション作成: customer=${customerId}, status=${subscription.status}`
        );

        await updateUserPlan(customerId, "paid");
        break;
      }

      // -----------------------------------------------------------------
      // サブスクリプション削除（解約） → 無料プランに変更
      // -----------------------------------------------------------------
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        console.log(
          `[Webhook] サブスクリプション削除: customer=${customerId}`
        );

        await updateUserPlan(customerId, "free");
        break;
      }

      // -----------------------------------------------------------------
      // サブスクリプション更新（プラン変更・ステータス変更）
      // -----------------------------------------------------------------
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        const newPlanType = planTypeFromStatus(subscription.status);

        console.log(
          `[Webhook] サブスクリプション更新: customer=${customerId}, status=${subscription.status}, plan=${newPlanType}`
        );

        await updateUserPlan(customerId, newPlanType);
        break;
      }

      // -----------------------------------------------------------------
      // 決済成功 → ログ記録
      // -----------------------------------------------------------------
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? "unknown";

        console.log(
          `[Webhook] 決済成功: customer=${customerId}, amount=${invoice.amount_paid}${invoice.currency?.toUpperCase()}, invoice=${invoice.id}`
        );

        // 決済成功を payment_logs テーブルに記録（テーブルが存在する場合）
        const { error: logError } = await supabase
          .from("payment_logs")
          .insert({
            stripe_customer_id: customerId,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: "succeeded",
          });

        if (logError) {
          // テーブルが存在しない場合でもWebhookは成功扱いにする
          console.warn(
            `決済ログの記録に失敗しました（テーブル未作成の可能性）: ${logError.message}`
          );
        }
        break;
      }

      // -----------------------------------------------------------------
      // 決済失敗 → ユーザーにフラグを設定
      // -----------------------------------------------------------------
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? "unknown";

        console.error(
          `[Webhook] 決済失敗: customer=${customerId}, invoice=${invoice.id}`
        );

        // ユーザーに決済失敗フラグを設定
        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (user) {
          const { error: flagError } = await supabase
            .from("users")
            .update({
              payment_failed_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          if (flagError) {
            console.error(
              `決済失敗フラグの設定に失敗しました (user_id: ${user.id}):`,
              flagError.message
            );
          }
        }

        // 決済失敗も payment_logs に記録
        const { error: logError } = await supabase
          .from("payment_logs")
          .insert({
            stripe_customer_id: customerId,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_due,
            currency: invoice.currency,
            status: "failed",
          });

        if (logError) {
          console.warn(
            `決済ログの記録に失敗しました: ${logError.message}`
          );
        }
        break;
      }

      // -----------------------------------------------------------------
      // 未対応のイベント
      // -----------------------------------------------------------------
      default:
        console.log(`[Webhook] 未対応のイベントタイプ: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Webhook 処理中にエラーが発生しました";
    console.error(`[Webhook] 処理エラー: ${message}`);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
