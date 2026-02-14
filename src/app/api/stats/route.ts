import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ---------------------------------------------------------------------------
// GET /api/stats  –  Public platform statistics
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    const supabase = getSupabase();

    // Run all queries in parallel for speed
    const [
      totalPlayersResult,
      totalPlayTimeResult,
      todayPlayersResult,
      totalGamesResult,
      highestLevelResult,
    ] = await Promise.all([
      // Total distinct players who have submitted scores
      supabase
        .from("game_scores")
        .select("user_id", { count: "exact", head: true }),

      // Sum of all time_seconds
      supabase
        .from("game_scores")
        .select("time_seconds"),

      // Distinct players who played today
      (() => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        return supabase
          .from("game_scores")
          .select("user_id", { count: "exact", head: true })
          .gte("played_at", todayStart.toISOString());
      })(),

      // Total number of games
      supabase
        .from("games")
        .select("id", { count: "exact", head: true }),

      // Highest level among all users
      supabase
        .from("users")
        .select("level")
        .order("level", { ascending: false })
        .limit(1)
        .single(),
    ]);

    // --- Process: totalPlayers ---
    // The count with head:true gives us the total rows, but we need distinct.
    // Supabase doesn't support COUNT(DISTINCT) directly via the JS client,
    // so we fall back to a manual approach if needed. For now we use the count
    // which represents all score rows; for a more accurate distinct count we
    // query user_ids separately.
    let totalPlayers = 0;
    {
      const { data: playerRows, error } = await supabase
        .from("game_scores")
        .select("user_id");

      if (!error && playerRows) {
        const uniqueUsers = new Set(playerRows.map((r: { user_id: string }) => r.user_id));
        // Exclude "anonymous" from the count if desired
        uniqueUsers.delete("anonymous");
        totalPlayers = uniqueUsers.size;
      }
    }

    // --- Process: totalPlayTime ---
    let totalPlayTime = 0;
    if (!totalPlayTimeResult.error && totalPlayTimeResult.data) {
      totalPlayTime = totalPlayTimeResult.data.reduce(
        (sum: number, row: { time_seconds: number | null }) =>
          sum + (row.time_seconds ?? 0),
        0
      );
    }

    // --- Process: todayPlayers ---
    let todayPlayers = 0;
    {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { data: todayRows, error } = await supabase
        .from("game_scores")
        .select("user_id")
        .gte("played_at", todayStart.toISOString());

      if (!error && todayRows) {
        const uniqueToday = new Set(todayRows.map((r: { user_id: string }) => r.user_id));
        uniqueToday.delete("anonymous");
        todayPlayers = uniqueToday.size;
      }
    }

    // --- Process: totalGames ---
    const totalGames = totalGamesResult.count ?? 0;

    // --- Process: highestLevel ---
    const highestLevel = highestLevelResult.data?.level ?? 1;

    const response = NextResponse.json({
      totalPlayers,
      totalPlayTime,
      todayPlayers,
      totalGames,
      highestLevel,
    });

    // Cache for 60 seconds
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");

    return response;
  } catch (err: unknown) {
    console.error("Unhandled error in GET /api/stats:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
