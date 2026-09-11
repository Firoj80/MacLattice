import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { BlogCta } from "@/components/blog-cta";
import { JsonLd } from "@/components/json-ld";
import { MarkdownBody } from "@/components/markdown-body";
import { SiteShell } from "@/components/site-shell";
import { blogSeoDescription } from "@/data/blog-seo";
import { getPost, relatedPosts } from "@/data/blog";
import { SITE } from "@/data/site";
import { blogPostingJsonLd, pageHead } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post, related: relatedPosts(params.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return pageHead({
        title: "Scan My Disk Blog",
        description: "Mac storage tips and guides from Scan My Disk.",
        path: "/blog",
      });
    }
    const { post } = loaderData;
    const description = blogSeoDescription(post.slug, post.excerpt);
    return pageHead({
      title: `${post.title} | ${SITE.name}`,
      description,
      path: `/blog/${post.slug}`,
      type: "article",
      published: post.date,
      ogTitle: post.title,
    });
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <p className="mt-3 text-muted">That guide doesn't exist.</p>
        <Link to="/blog" className="mt-6 inline-block text-sm text-primary">
          Back to blog
        </Link>
      </div>
    </SiteShell>
  ),
});

function BlogPostPage() {
  const { post, related } = Route.useLoaderData();

  return (
    <SiteShell>
      <JsonLd
        data={blogPostingJsonLd({
          title: post.title,
          description: blogSeoDescription(post.slug, post.excerpt),
          slug: post.slug,
          date: post.date,
          author: post.author,
        })}
      />
      <article className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center text-sm text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to blog
        </Link>
        <header className="mb-8">
          <h1 className="font-display mb-6 text-4xl leading-tight font-medium tracking-tight text-fg md:text-5xl">
            {post.title}
          </h1>
          <div className="mb-8 flex items-center gap-4 border-b border-border pb-8 text-muted">
            <span className="font-medium text-fg">{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-fg/20" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
        </header>
        <div>
          <MarkdownBody markdown={post.body} />
        </div>

        <BlogCta />

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-display mb-4 text-xl font-medium text-fg">Continue Reading</h2>
          <div className="grid gap-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/blog/$slug"
                params={{ slug: r.slug }}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-fg transition-colors group-hover:text-primary">
                    {r.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-sm text-muted">{r.excerpt}</p>
                </div>
                <ChevronRight className="mt-1 h-5 w-5 text-muted transition-colors group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>
      </article>
    </SiteShell>
  );
}
