import { sampleGames } from "@/data/sample-games";
import GameDetailClient from "./GameDetailClient";

export function generateStaticParams() {
  return sampleGames.map((game) => ({
    gameId: game.id,
  }));
}

export default function GameDetailPage({
  params,
}: {
  params: { gameId: string };
}) {
  return <GameDetailClient gameId={params.gameId} />;
}
