"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Eye, Edit, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  image?: string;
  createdAt: string;
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const articlesPerPage = 5;

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await api.get("/categories", {
        params: { page: 1, limit: 50 },
      });
      setCategories(res.data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
      toast.error("Gagal mengambil kategori");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/articles", {
        params: {
          page: currentPage,
          limit: articlesPerPage,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          search: searchTerm || undefined,
        },
      });

      const data = res.data;
      setArticles(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalArticles(data.total || 0);
      console.log("Fetched articles:", data.data);
    } catch (err: any) {
      console.error("Failed to fetch articles:", err);

      if (err.response?.status === 401) {
        toast.error("Session expired, silakan login kembali");
      } else if (err.response?.status === 403) {
        toast.error("Anda tidak memiliki akses untuk melihat artikel");
      } else if (err.response?.status >= 500) {
        toast.error("Server error, silakan coba lagi");
      } else {
        toast.error("Gagal mengambil artikel");
      }

      setArticles([]);
      setTotalPages(1);
      setTotalArticles(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    type: "category" | "search" | "page",
    value: any
  ) => {
    if (type === "category") {
      setSelectedCategory(value);
      setCurrentPage(1);
    } else if (type === "search") {
      setSearchTerm(value);
      setCurrentPage(1);
    } else if (type === "page") {
      setCurrentPage(value);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchArticles();
      } else {
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [currentPage, selectedCategory]);

  const handleDeleteArticle = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/articles/${id}`);
      toast.success("Artikel berhasil dihapus");

      await fetchArticles();
    } catch (err: any) {
      console.error("Failed to delete article:", err);

      if (err.response?.status === 404) {
        toast.error("Artikel tidak ditemukan");
      } else if (err.response?.status === 403) {
        toast.error("Anda tidak memiliki akses untuk menghapus artikel");
      } else {
        toast.error("Gagal menghapus artikel");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Articles</h1>
          <p className="text-gray-600 mt-1">
            Total Articles: {totalArticles}
            {searchTerm && ` • Filtered by: "${searchTerm}"`}
            {selectedCategory !== "All" && ` • Category: ${selectedCategory}`}
          </p>
        </div>

        <Button onClick={fetchArticles} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={selectedCategory}
            onValueChange={(val) => handleFilterChange("category", val)}
            disabled={loadingCategories}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by title..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
        </div>

        <Link href="/admin/articles/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Article
          </Button>
        </Link>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
          <div className="col-span-2">Thumbnail</div>
          <div className="col-span-4">Title</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-2">Actions</div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm || selectedCategory !== "All"
              ? "No articles found matching your filters"
              : "No articles found"}
          </div>
        ) : (
          articles.map((article) => (
            <div
              key={article.id}
              className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="col-span-2">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={60}
                  height={40}
                  className="rounded object-cover"
                />
              </div>
              <div className="col-span-4">
                <h3 className="font-medium text-gray-900 line-clamp-2">
                  {article.title}
                </h3>
              </div>
              <div className="col-span-2">
                <Badge variant="secondary">
                  {article.category?.name || "Uncategorized"}
                </Badge>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-600">
                  {new Date(article.createdAt).toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                  asChild
                >
                  <Link href={`/articles/${article.id}`}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                  asChild
                >
                  <Link href={`/admin/articles/edit/${article.id}`}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      disabled={deletingId === article.id}
                    >
                      {deletingId === article.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                      )}
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Article</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{article.title}"? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteArticle(article.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange("page", currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant="ghost"
              size="sm"
              onClick={() => handleFilterChange("page", page)}
              disabled={loading}
              className={
                currentPage === page
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : ""
              }
            >
              {page}
            </Button>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange("page", currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
