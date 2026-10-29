import { createFileRoute } from "@tanstack/react-router";
import { ResearchArticle } from "@/components/research-article";
import { guideStudy } from "@/lib/research/study";
import { pageHead } from "@/lib/seo";

const study = guideStudy();

export const Route = createFileRoute("/research/guides")({
  component: GuideResearchPage,
  head: () => pageHead({ title: study.title, description: study.description, path: study.path }),
});

function GuideResearchPage() {
  return <ResearchArticle study={study} />;
}
