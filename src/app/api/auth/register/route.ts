import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Supabase サービスロールクライアント
// ---------------------------------------------------------------------------

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ---------------------------------------------------------------------------
// リクエストボディの型
// ---------------------------------------------------------------------------

interface RegisterBody {
  /** メールアドレス */
  email: string;
  /** パスワード */
  password: string;
  /** 表示名 */
  name: string;
  /** 学年（小1〜高3） */
  grade: string;
  /** 役割（child または parent） */
  role: "child" | "parent";
  /** 保護者のメールアドレス（子どもアカウントの場合） */
  parentEmail?: string;
}

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ユーザー新規登録エンドポイント
// ---------------------------------------------------------------------------

/**
 * ユーザー新規登録
 *
 * - Supabase Auth にユーザーを作成
 * - users テーブルに対応する行を作成
 * - 子どもアカウントの場合、保護者のメールアドレスから parent_id を紐付け
 *
 * @param request - { email, password, name, grade, role, parentEmail? }
 * @returns { user_id, success } または エラーレスポンス
 */
export async function POST(request: Request) {
  try {
    const body: RegisterBody = await request.json();

    // --- バリデーション ---
    if (!body.email || !body.password || !body.name || !body.grade || !body.role) {
      return NextResponse.json(
        { success: false, error: "必須フィールドが不足しています: email, password, name, grade, role" },
        { status: 400 }
      );
    }

    if (!["child", "parent"].includes(body.role)) {
      return NextResponse.json(
        { success: false, error: "role は 'child' または 'parent' を指定してください" },
        { status: 400 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, error: "パスワードは6文字以上で設定してください" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // --- Supabase Auth にユーザーを作成 ---
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true, // メール確認を自動で完了扱いにする
      user_metadata: {
        name: body.name,
        role: body.role,
        grade: body.grade,
      },
    });

    if (authError) {
      console.error("Supabase Auth ユーザー作成エラー:", authError.message);

      // メールアドレス重複の場合
      if (authError.message.includes("already been registered") || authError.message.includes("already exists")) {
        return NextResponse.json(
          { success: false, error: "このメールアドレスは既に登録されています" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: `ユーザー作成に失敗しました: ${authError.message}` },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: "ユーザーの作成に失敗しました" },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // --- 子どもアカウントの場合、保護者を検索 ---
    let parentId: string | null = null;

    if (body.role === "child" && body.parentEmail) {
      const { data: parentUser, error: parentError } = await supabase
        .from("users")
        .select("id")
        .eq("email", body.parentEmail)
        .eq("role", "parent")
        .single();

      if (parentError || !parentUser) {
        console.warn(
          `保護者が見つかりません (email: ${body.parentEmail}): ${parentError?.message ?? "該当なし"}`
        );
        // 保護者が見つからなくても登録は続行する（後から紐付け可能）
      } else {
        parentId = parentUser.id;
      }
    }

    // --- users テーブルに行を作成 ---
    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      email: body.email,
      name: body.name,
      grade: body.grade,
      role: body.role,
      parent_id: parentId,
      level: 1,
      xp: 0,
      plan_type: "free",
      total_play_time: 0,
    });

    if (insertError) {
      console.error("users テーブルへの挿入エラー:", insertError.message);

      // Auth ユーザーは作成済みなので、ロールバックを試みる
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
      if (deleteError) {
        console.error(
          `Auth ユーザーのロールバックに失敗しました (user_id: ${userId}):`,
          deleteError.message
        );
      }

      return NextResponse.json(
        { success: false, error: `ユーザー情報の保存に失敗しました: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user_id: userId,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("POST /api/auth/register で予期せぬエラー:", err);
    const message =
      err instanceof Error ? err.message : "サーバー内部エラーが発生しました";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
