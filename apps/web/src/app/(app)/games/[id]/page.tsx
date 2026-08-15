import { notFound } from "next/navigation";
import { getMatchIntelligence } from "../../../../lib/match-intelligence-service";
import { MatchIntelligenceView } from "./match-intelligence-view";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchIntelligencePage({ params }: MatchPageProps) {
  const { id } = await params;
  const data = await getMatchIntelligence(id);

  if (!data) {
    notFound();
  }

  return <MatchIntelligenceView data={data} />;
}
