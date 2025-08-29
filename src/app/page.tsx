import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArticleCard } from "@/components/article-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchArticles } from "@/lib/article";

export default async function HomePage() {
  const { data: articles, total } = await fetchArticles({ page: 1, limit: 9 });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-blue-200 mb-4">Blog genzel</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            The Journal : Design Resources, Interviews, and Industry News
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Your daily dose of design insights!
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <Select>
              <SelectTrigger className="bg-white text-gray-900">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {/* TODO: fetch kategori dari API */}
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search articles..."
                className="pl-10 bg-white text-gray-900"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-6">
          <p className="text-muted-foreground mb-8">
            Showing : {articles.length} of {total} articles
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                slug={article.id}
                title={article.title}
                excerpt={article.content.slice(0, 100) + "..."}
                image={article.image || "/placeholder.svg"}
                date={article.createdAt}
                tags={[article.category.name]}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <span className="px-2 py-1">...</span>
            </div>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
