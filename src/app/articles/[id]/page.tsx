import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArticleCard } from "@/components/article-card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import Image from "next/image";

import { fetchArticleById, fetchRelatedArticles } from "@/lib/article";

interface ArticlePageProps {
  params: { id: string };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;

  let article;
  try {
    article = await fetchArticleById(params.id);
  } catch (err) {
    return notFound();
  }

  if (!article) return notFound();

  const relatedArticles = await fetchRelatedArticles(
    article.categoryId,
    article.id
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <article className="py-12">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Article Header */}
            <div className="text-center mb-8">
              <p className="text-muted-foreground mb-2">
                {new Date(article.createdAt).toLocaleDateString()} • Created by{" "}
                {article.user.username}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-balance">
                {article.title}
              </h1>
            </div>

            {/* Featured Image */}
            <div className="aspect-video relative mb-8 rounded-lg overflow-hidden">
              <Image
                src={"/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <p>{article.content}</p>
            </div>

            {/* Category as tag */}
            <div className="flex gap-2 mb-8">
              <Badge variant="secondary">{article.category.name}</Badge>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-6">
              <h2 className="text-2xl font-bold mb-8">Other articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map((a) => (
                  <ArticleCard
                    key={a.id}
                    slug={a.id}
                    title={a.title}
                    excerpt={a.content.slice(0, 100) + "..."}
                    image={"https://via.placeholder.com/800x400"}
                    date={a.createdAt}
                    tags={[a.category.name]}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
