import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Supabase クライアント
// ---------------------------------------------------------------------------

function getSupabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getSupabaseAnon() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ---------------------------------------------------------------------------
// GET /api/auth
// 現在の認証状態を確認するエンドポイント
// ---------------------------------------------------------------------------

/**
 * 認証状態チェック
 *
 * - Authorization ヘッダーの Bearer トークンからユーザーを特定
 * - 認証済みの場合、users テーブルからプロフィール情報を返却
 * - 未認証の場合、{ authenticated: false } を返却
 *
 * @returns ユーザープロフィールまたは未認証レスポンス
 */
export async function GET(request: Request) {
  try {
    // --- Authorization ヘッダーからトークンを取得 ---
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    // --- トークンからユーザーを特定 ---
    const supabaseAnon = getSupabaseAnon();
    const { data: userData, error: authError } = await supabaseAnon.auth.getUser(token);

    if (authError || !userData.user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    const userId = userData.user.id;

    // --- users テーブルからプロフィール情報を取得 ---
    const supabaseServer = getSupabaseServer();
    const { data: profile, error: profileError } = await supabaseServer
      .from("users")
      .select("id, email, name, grade, role, parent_id, level, xp, plan_type, total_play_time, created_at")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      console.warn(
        `ユーザープロフィールが見つかりません (user_id: ${userId}):`,
        profileError?.message
      );
      // Auth には存在するが users テーブルに行がない場合
      return NextResponse.json({
        authenticated: true,
        user: {
          id: userId,
          email: userData.user.email,
          name: userData.user.user_metadata?.name ?? null,
          role: userData.user.user_metadata?.role ?? null,
          profile_incomplete: true,
        },
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: profile,
    });
  } catch (err: unknown) {
    console.error("GET /api/auth で予期せぬエラー:", err);
    const message =
      err instanceof Error ? err.message : "サーバー内部エラーが発生しました";
    return NextResponse.json(
      { authenticated: false, error: message },
      { status: 500 }
    );
  }
}
