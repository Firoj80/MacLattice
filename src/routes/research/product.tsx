import { createFileRoute } from "@tanstack/react-router";
import { ResearchArticle } from "@/components/research-article";
import { productStudy } from "@/lib/research/study";
import { pageHead } from "@/lib/seo";

const study = productStudy();

export const Route = createFileRoute("/research/product")({
  component: ProductResearchPage,
  head: () => pageHead({ title: study.title, description: study.description, path: study.path }),
});

function ProductResearchPage() {
  return <ResearchArticle study={study} />;
}
