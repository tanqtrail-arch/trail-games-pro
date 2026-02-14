import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Supabase クライアント（Anon Key でサインイン処理を行う）
// ---------------------------------------------------------------------------

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ---------------------------------------------------------------------------
// リクエストボディの型
// ---------------------------------------------------------------------------

interface LoginBody {
  /** メールアドレス */
  email: string;
  /** パスワード */
  password: string;
}

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ログインエンドポイント
// ---------------------------------------------------------------------------

/**
 * ユーザーログイン
 *
 * - Supabase Auth でメール/パスワード認証を実行
 * - セッション情報を返却
 *
 * @param request - { email, password }
 * @returns セッションデータ（access_token, refresh_token, user）または エラーレスポンス
 */
export async function POST(request: Request) {
  try {
    const body: LoginBody = await request.json();

    // --- バリデーション ---
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: "email と password は必須です" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // --- Supabase Auth でサインイン ---
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (signInError) {
      console.error("ログインエラー:", signInError.message);

      // 認証失敗の場合（メールアドレスまたはパスワードが不正）
      if (
        signInError.message.includes("Invalid login credentials") ||
        signInError.message.includes("invalid_grant")
      ) {
        return NextResponse.json(
          { success: false, error: "メールアドレスまたはパスワードが正しくありません" },
          { status: 401 }
        );
      }

      // メール未確認の場合
      if (signInError.message.includes("Email not confirmed")) {
        return NextResponse.json(
          { success: false, error: "メールアドレスの確認が完了していません" },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { success: false, error: `ログインに失敗しました: ${signInError.message}` },
        { status: 500 }
      );
    }

    if (!data.session || !data.user) {
      return NextResponse.json(
        { success: false, error: "セッションの取得に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        expires_in: data.session.expires_in,
      },
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role ?? null,
        name: data.user.user_metadata?.name ?? null,
      },
    });
  } catch (err: unknown) {
    console.error("POST /api/auth/login で予期せぬエラー:", err);
    const message =
      err instanceof Error ? err.message : "サーバー内部エラーが発生しました";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
