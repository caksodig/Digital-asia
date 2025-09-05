"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
import { Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { fetchArticles } from "@/lib/article";
import { toast } from "sonner";

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const visibilityRef = useRef<boolean>(true);

  const loadArticles = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      try {
        const res = await fetchArticles({
          page,
          limit: 9,
          search: search || undefined,
          categoryId: category !== "all" ? category : undefined,
        });

        // Check if data actually changed
        const hasChanges =
          JSON.stringify(articles) !== JSON.stringify(res.data);

        setArticles(res.data);
        setTotal(res.total);
        setLastUpdated(new Date());

        // Show notification if data changed during auto-refresh
        if (showRefreshing && hasChanges && articles.length > 0) {
          toast.success("Articles updated!", {
            description: "New content is available",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Failed to load articles:", error);
        if (showRefreshing) {
          toast.error("Failed to refresh articles");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, search, category, articles]
  );

  const handleManualRefresh = () => {
    loadArticles(true);
  };

  // Setup auto-refresh
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (visibilityRef.current && !loading && !refreshing) {
        loadArticles(true);
      }
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loadArticles, loading, refreshing]);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      visibilityRef.current = !document.hidden;
      if (!document.hidden && !loading && !refreshing) {
        loadArticles(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadArticles, loading, refreshing]);

  useEffect(() => {
    const handleFocus = () => {
      if (!loading && !refreshing) {
        loadArticles(true);
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadArticles, loading, refreshing]);

  useEffect(() => {
    loadArticles();
  }, [page, search, category]);

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white pb-16"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, rgba(37, 99, 235, 0.8), rgba(29, 78, 216, 0.8)), url('/hero.jpg')",
        }}
      >
        <Header />
        <div className="container mx-auto px-6 text-center">
          <p className="text-blue-200 mb-4">Blog genzet</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            The Journal : Design Resources, Interviews, and Industry News
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Your daily dose of design insights!
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <Select
              value={category}
              onValueChange={(val) => {
                setCategory(val);
                setPage(1);
              }}
            >
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
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-6">
          {/* Article Count and Refresh Button */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <p className="text-muted-foreground">
                Showing: {articles.length} of {total} articles
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: {formatLastUpdated(lastUpdated)}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={refreshing || loading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center gap-2 text-gray-500">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Loading articles...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    slug={article.id}
                    title={article.title}
                    excerpt={article.content.slice(0, 100) + "..."}
                    imageUrl={article.imageUrl || "/placeholder.svg"}
                    date={article.createdAt}
                    tags={[article.category?.name]}
                  />
                ))}
              </div>

              {/* No Articles Found */}
              {articles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No articles found</p>
                  <p className="text-gray-400">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {articles.length > 0 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading || refreshing}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <Button variant="default" size="sm">
                {page}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={articles.length < 9 || loading || refreshing}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {refreshing && (
            <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Checking for updates...</span>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
