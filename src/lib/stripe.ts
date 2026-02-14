import Stripe from "stripe";

// ---------------------------------------------------------------------------
// Stripe クライアント初期化
// ---------------------------------------------------------------------------

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });
}

// ---------------------------------------------------------------------------
// 定数
// ---------------------------------------------------------------------------

/** 月額料金（日本円） */
const MONTHLY_PRICE_JPY = 980;

/** サイトのベースURL */
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// ---------------------------------------------------------------------------
// Stripe ユーティリティ関数
// ---------------------------------------------------------------------------

/**
 * Stripe Checkout セッションを作成する。
 *
 * 月額980円のサブスクリプション購入用のCheckoutページへリダイレクトするための
 * セッションを生成する。
 *
 * @param userId - TRAILプラットフォームのユーザーID（メタデータとして保存）
 * @param email - ユーザーのメールアドレス（Checkout画面に事前入力）
 * @returns Stripe Checkout セッションオブジェクト
 *
 * @example
 * ```typescript
 * const session = await createCheckoutSession(userId, user.email);
 * // session.url にリダイレクトしてCheckoutページを表示
 * ```
 */
export async function createCheckoutSession(
  userId: string,
  email: string
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "jpy",
          product_data: {
            name: "探究教室 TRAIL 有料プラン",
            description: "全ゲームプレイ可能・詳細スキルレポート・広告非表示",
          },
          unit_amount: MONTHLY_PRICE_JPY,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
    success_url: `${BASE_URL}/dashboard/parent?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/pricing`,
    // 日本語ロケール
    locale: "ja",
    // サブスクリプション作成時にもメタデータを付与
    subscription_data: {
      metadata: {
        userId,
      },
    },
  });

  return session;
}

/**
 * Stripe カスタマーポータルセッションを作成する。
 *
 * 既存の有料ユーザーがサブスクリプションの管理（プラン変更・解約・支払い方法の更新）を
 * 行うためのポータルページセッションを生成する。
 *
 * @param customerId - Stripe の顧客ID（cus_xxx）
 * @returns Stripe Billing Portal セッションオブジェクト
 *
 * @example
 * ```typescript
 * const portalSession = await createPortalSession(user.stripe_customer_id);
 * // portalSession.url にリダイレクトしてポータルページを表示
 * ```
 */
export async function createPortalSession(
  customerId: string
): Promise<Stripe.BillingPortal.Session> {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${BASE_URL}/dashboard/parent`,
  });

  return session;
}

/**
 * ユーザーのサブスクリプションがアクティブかどうかを確認する。
 *
 * Stripe の顧客IDから現在のサブスクリプション一覧を取得し、
 * active または trialing のサブスクリプションが存在するかを返す。
 *
 * @param customerId - Stripe の顧客ID（cus_xxx）
 * @returns アクティブなサブスクリプションの有無と詳細情報
 *
 * @example
 * ```typescript
 * const status = await getSubscriptionStatus(user.stripe_customer_id);
 * if (status.isActive) {
 *   // 有料機能を許可
 * }
 * ```
 */
export async function getSubscriptionStatus(customerId: string): Promise<{
  /** サブスクリプションがアクティブか */
  isActive: boolean;
  /** 現在のサブスクリプションステータス */
  status: Stripe.Subscription.Status | null;
  /** サブスクリプションID */
  subscriptionId: string | null;
  /** 現在の期間の終了日（ISO 8601） */
  currentPeriodEnd: string | null;
  /** 解約予定かどうか */
  cancelAtPeriodEnd: boolean;
}> {
  try {
    const stripe = getStripe();
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 1,
      expand: ["data.default_payment_method"],
    });

    if (subscriptions.data.length === 0) {
      return {
        isActive: false,
        status: null,
        subscriptionId: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    const subscription = subscriptions.data[0];
    const isActive =
      subscription.status === "active" || subscription.status === "trialing";

    return {
      isActive,
      status: subscription.status,
      subscriptionId: subscription.id,
      currentPeriodEnd: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };
  } catch (err: unknown) {
    console.error(
      `サブスクリプション状態の取得に失敗しました (customer: ${customerId}):`,
      err instanceof Error ? err.message : err
    );

    return {
      isActive: false,
      status: null,
      subscriptionId: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    };
  }
}
