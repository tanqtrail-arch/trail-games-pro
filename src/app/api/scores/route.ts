import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface QuestionDetail {
  question: string;
  correct: boolean;
  time: number;
}

interface Skills {
  思考力: number;
  探究力: number;
  創造力: number;
}

interface ScoreSubmission {
  game_id: string;
  user_id?: string;
  grade?: number;
  score: number;
  max_score: number;
  time_seconds?: number;
  skills?: Skills;
  subject?: string;
  details?: QuestionDetail[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Calculate user level from total XP using a simple formula. */
function calculateLevel(xp: number): number {
  // Every 100 XP = 1 level, minimum level 1
  return Math.max(1, Math.floor(xp / 100) + 1);
}

// ---------------------------------------------------------------------------
// POST /api/scores  –  Submit a score
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body: ScoreSubmission = await request.json();

    // --- Validation ---
    if (!body.game_id || body.score === undefined || body.max_score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: game_id, score, and max_score are required." },
        { status: 400 }
      );
    }

    if (typeof body.score !== "number" || typeof body.max_score !== "number") {
      return NextResponse.json(
        { error: "score and max_score must be numbers." },
        { status: 400 }
      );
    }

    if (body.max_score <= 0) {
      return NextResponse.json(
        { error: "max_score must be greater than 0." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const userId = body.user_id || "anonymous";

    // --- Insert into game_scores ---
    const { data: scoreData, error: scoreError } = await supabase
      .from("game_scores")
      .insert({
        game_id: body.game_id,
        user_id: userId,
        grade: body.grade ?? null,
        score: body.score,
        max_score: body.max_score,
        time_seconds: body.time_seconds ?? null,
        skills: body.skills ?? null,
        subject: body.subject ?? null,
        details: body.details ?? null,
      })
      .select("id")
      .single();

    if (scoreError) {
      console.error("Error inserting game_score:", scoreError);
      return NextResponse.json(
        { error: "Failed to save score.", details: scoreError.message },
        { status: 500 }
      );
    }

    // --- Insert into game_sessions ---
    const { error: sessionError } = await supabase
      .from("game_sessions")
      .insert({
        game_id: body.game_id,
        user_id: userId,
        completed: true,
        score: body.score,
        time_seconds: body.time_seconds ?? null,
      });

    if (sessionError) {
      // Log but don't fail the whole request – the score was already saved.
      console.error("Error inserting game_session:", sessionError);
    }

    // --- XP / Level update for authenticated users ---
    let xpGained = 0;
    let newLevel: number | null = null;

    if (userId !== "anonymous") {
      xpGained = Math.round((body.score / body.max_score) * 100);

      // Fetch current user data
      const { data: userData, error: userFetchError } = await supabase
        .from("users")
        .select("xp, level, total_play_time")
        .eq("id", userId)
        .single();

      if (userFetchError) {
        console.error("Error fetching user for XP update:", userFetchError);
      } else if (userData) {
        const currentXp: number = userData.xp ?? 0;
        const currentPlayTime: number = userData.total_play_time ?? 0;

        const updatedXp = currentXp + xpGained;
        newLevel = calculateLevel(updatedXp);
        const updatedPlayTime = currentPlayTime + (body.time_seconds ?? 0);

        const { error: userUpdateError } = await supabase
          .from("users")
          .update({
            xp: updatedXp,
            level: newLevel,
            total_play_time: updatedPlayTime,
          })
          .eq("id", userId);

        if (userUpdateError) {
          console.error("Error updating user XP/level:", userUpdateError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      score_id: scoreData.id,
      xp_gained: xpGained,
      new_level: newLevel,
    });
  } catch (err: unknown) {
    console.error("Unhandled error in POST /api/scores:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// GET /api/scores  –  Fetch scores
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("game_id");
    const userId = searchParams.get("user_id");
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") ?? "10", 10) || 10, 1),
      100
    );

    const supabase = getSupabase();

    let query = supabase
      .from("game_scores")
      .select("*")
      .order("played_at", { ascending: false })
      .limit(limit);

    if (gameId) {
      query = query.eq("game_id", gameId);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching scores:", error);
      return NextResponse.json(
        { error: "Failed to fetch scores.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ scores: data });
  } catch (err: unknown) {
    console.error("Unhandled error in GET /api/scores:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
