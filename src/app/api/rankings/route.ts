import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Return the ISO date string for the start of the requested period.
 * Returns null for "all" (no date filter).
 */
function getPeriodStart(period: string): string | null {
  const now = new Date();

  switch (period) {
    case "daily": {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return start.toISOString();
    }
    case "weekly": {
      const day = now.getDay(); // 0 = Sunday
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
      const start = new Date(now.getFullYear(), now.getMonth(), diff);
      return start.toISOString();
    }
    case "monthly": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return start.toISOString();
    }
    case "all":
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// GET /api/rankings
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("game_id");
    const grade = searchParams.get("grade");
    const period = searchParams.get("period") ?? "all";
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") ?? "20", 10) || 20, 1),
      100
    );

    const supabase = getSupabase();
    const periodStart = getPeriodStart(period);

    if (gameId) {
      // ------------------------------------------------------------------
      // Rankings for a specific game – highest score per user
      // ------------------------------------------------------------------
      let query = supabase
        .from("game_scores")
        .select("user_id, score, grade")
        .eq("game_id", gameId)
        .order("score", { ascending: false })
        .limit(limit * 5); // fetch extra rows before deduplication

      if (periodStart) {
        query = query.gte("played_at", periodStart);
      }

      if (grade) {
        query = query.eq("grade", parseInt(grade, 10));
      }

      const { data: scores, error: scoresError } = await query;

      if (scoresError) {
        console.error("Error fetching game rankings:", scoresError);
        return NextResponse.json(
          { error: "Failed to fetch rankings.", details: scoresError.message },
          { status: 500 }
        );
      }

      // Deduplicate: keep highest score per user
      const bestByUser = new Map<
        string,
        { user_id: string; score: number; grade: number | null }
      >();

      for (const row of scores ?? []) {
        const existing = bestByUser.get(row.user_id);
        if (!existing || row.score > existing.score) {
          bestByUser.set(row.user_id, {
            user_id: row.user_id,
            score: row.score,
            grade: row.grade,
          });
        }
      }

      // Sort descending by score and assign ranks
      const sorted = Array.from(bestByUser.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      // Batch-fetch user display names and levels
      const userIds = sorted.map((r) => r.user_id).filter((id) => id !== "anonymous");

      let userMap = new Map<string, { name: string; level: number }>();
      if (userIds.length > 0) {
        const { data: users } = await supabase
          .from("users")
          .select("id, name, level")
          .in("id", userIds);

        for (const u of users ?? []) {
          userMap.set(u.id, { name: u.name ?? "Unknown", level: u.level ?? 1 });
        }
      }

      const rankings = sorted.map((entry, index) => {
        const userInfo = userMap.get(entry.user_id);
        return {
          rank: index + 1,
          user_id: entry.user_id,
          name: userInfo?.name ?? (entry.user_id === "anonymous" ? "Anonymous" : "Unknown"),
          score: entry.score,
          grade: entry.grade,
          level: userInfo?.level ?? 1,
        };
      });

      return NextResponse.json({ rankings });
    } else {
      // ------------------------------------------------------------------
      // Overall rankings by total XP
      // ------------------------------------------------------------------
      let query = supabase
        .from("users")
        .select("id, name, xp, grade, level")
        .order("xp", { ascending: false })
        .limit(limit);

      if (grade) {
        query = query.eq("grade", parseInt(grade, 10));
      }

      const { data: users, error: usersError } = await query;

      if (usersError) {
        console.error("Error fetching overall rankings:", usersError);
        return NextResponse.json(
          { error: "Failed to fetch rankings.", details: usersError.message },
          { status: 500 }
        );
      }

      // If a period filter is given for overall rankings, we could further
      // refine, but XP is cumulative so we simply return the top users.
      const rankings = (users ?? []).map((user, index) => ({
        rank: index + 1,
        user_id: user.id,
        name: user.name ?? "Unknown",
        score: user.xp ?? 0,
        grade: user.grade ?? null,
        level: user.level ?? 1,
      }));

      return NextResponse.json({ rankings });
    }
  } catch (err: unknown) {
    console.error("Unhandled error in GET /api/rankings:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
