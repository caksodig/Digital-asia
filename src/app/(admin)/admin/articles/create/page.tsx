"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Upload,
  Bold,
  Italic,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";
import { toast } from "sonner";
import { uploadFile } from "@/lib/utils/upload"; // Import the utility

interface Category {
  id: string;
  name: string;
}

interface CreateArticleData {
  title: string;
  content: string;
  categoryId: string;
  imageUrl?: string;
}

export default function CreateArticlePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    content: "",
    thumbnail: null as File | null,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories", {
          params: { page: 1, limit: 50 },
        });

        console.log("Categories response:", response.data);

        const validCategories = (response.data.data || []).filter(
          (cat: any) =>
            cat &&
            cat.id &&
            cat.name &&
            typeof cat.id === "string" &&
            cat.id.trim() !== ""
        );

        setCategories(validCategories);

        if (validCategories.length === 0) {
          toast.warning(
            "Tidak ada kategori tersedia. Silakan buat kategori terlebih dahulu."
          );
        }
      } catch (error: any) {
        console.error("Failed to fetch categories:", error);
        console.error("Categories error response:", error.response?.data);
        toast.error("Gagal mengambil daftar kategori");
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar (JPG, PNG)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      setFormData({ ...formData, thumbnail: file });
      setErrors({ ...errors, thumbnail: "" });

      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setFormData({ ...formData, content });
    setWordCount(content.trim().split(/\s+/).filter(Boolean).length);
    if (content.trim()) {
      setErrors({ ...errors, content: "" });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title });
    if (title.trim()) {
      setErrors({ ...errors, title: "" });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData({ ...formData, categoryId });
    if (categoryId) {
      setErrors({ ...errors, categoryId: "" });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      setFormData({ ...formData, thumbnail: file });
      setErrors({ ...errors, thumbnail: "" });

      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setThumbnailPreview(null);
    setFormData({ ...formData, thumbnail: null });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Judul artikel wajib diisi";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Kategori wajib dipilih";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Konten artikel wajib diisi";
    } else if (formData.content.trim().length < 50) {
      newErrors.content = "Konten minimal 50 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadThumbnail = async (file: File): Promise<string | null> => {
    const result = await uploadFile(file);

    if (!result.success) {
      throw new Error(result.error || "Upload failed");
    }

    return result.url || null;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = null;

      if (formData.thumbnail) {
        try {
          console.log("Starting thumbnail upload...");
          imageUrl = await uploadThumbnail(formData.thumbnail);
          console.log("Thumbnail uploaded successfully:", imageUrl);
        } catch (error: any) {
          console.error("Thumbnail upload error:", error);
          toast.error(`Gagal mengupload thumbnail: ${error.message}`);
          setIsLoading(false);
          return;
        }
      }

      const articleData: CreateArticleData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        categoryId: formData.categoryId,
        ...(imageUrl && { imageUrl }),
      };
      console.log("Submitting article data:", articleData);

      const response = await api.post("/articles", articleData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Article created successfully:", response.data);
      toast.success("Artikel berhasil dibuat! 🎉");

      setTimeout(() => {
        router.push("/admin/articles");
      }, 1500);
    } catch (error: any) {
      console.error("Create article failed:", error);
      console.error("Article creation error response:", error.response?.data);
      console.error("Article creation error status:", error.response?.status);

      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || "Data tidak valid";
        toast.error(errorMessage);

        if (error.response.data?.errors) {
          setErrors(error.response.data.errors);
        }
      } else if (error.response?.status === 401) {
        toast.error("Session expired, silakan login kembali");
        router.push("/login");
      } else if (error.response?.status === 403) {
        toast.error("Anda tidak memiliki akses untuk membuat artikel");
      } else if (error.response?.status === 422) {
        toast.error("Data tidak valid, periksa kembali form Anda");
      } else {
        toast.error("Gagal membuat artikel, silakan coba lagi");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Judul dan konten diperlukan untuk preview");
      return;
    }
    toast.info("Preview functionality coming soon!");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/articles">
          <Button variant="ghost" size="sm" disabled={isLoading}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Create New Article</h1>
      </div>

      <div className="max-w-4xl">
        {/* Thumbnail Upload */}
        <div className="mb-6">
          <Label className="text-base font-medium mb-3 block">
            Thumbnail
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Optional)
            </span>
          </Label>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              errors.thumbnail
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() =>
              !isLoading && document.getElementById("thumbnail-upload")?.click()
            }
          >
            {thumbnailPreview ? (
              <div className="relative">
                <Image
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  width={200}
                  height={120}
                  className="mx-auto rounded object-cover"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={removeThumbnail}
                  disabled={isLoading}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Click to select files or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  Support File Type: JPG, PNG (Max 5MB)
                </p>
              </div>
            )}
            <input
              id="thumbnail-upload"
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleThumbnailChange}
              className="hidden"
              disabled={isLoading}
            />
          </div>
          {errors.thumbnail && (
            <p className="text-sm text-red-500 mt-1">{errors.thumbnail}</p>
          )}
        </div>

        {/* Title */}
        <div className="mb-6">
          <Label htmlFor="title" className="text-base font-medium mb-3 block">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Enter article title"
            value={formData.title}
            onChange={handleTitleChange}
            className={`text-base ${errors.title ? "border-red-300" : ""}`}
            disabled={isLoading}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-6">
          <Label className="text-base font-medium mb-3 block">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.categoryId}
            onValueChange={handleCategoryChange}
            disabled={isLoading || loadingCategories || categories.length === 0}
          >
            <SelectTrigger
              className={errors.categoryId ? "border-red-300" : ""}
            >
              <SelectValue
                placeholder={
                  loadingCategories
                    ? "Loading categories..."
                    : categories.length === 0
                    ? "No categories available"
                    : "Select category"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter((category) => category.id && category.name)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              {categories.length === 0 && !loadingCategories && (
                <SelectItem value="no-categories" disabled>
                  No categories available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            The existing category list can be seen in the{" "}
            <Link
              href="/admin/categories"
              className="text-blue-600 hover:underline"
            >
              category
            </Link>{" "}
            menu
            {categories.length === 0 && !loadingCategories && (
              <span className="text-orange-600 block mt-1">
                ⚠️ No categories found. Please create categories first.
              </span>
            )}
          </p>
        </div>

        {/* Rich Text Editor */}
        <div className="mb-6">
          <Label className="text-base font-medium mb-3 block">
            Content <span className="text-red-500">*</span>
          </Label>
          <div
            className={`border rounded-lg overflow-hidden ${
              errors.content ? "border-red-300" : "border-gray-200"
            }`}
          >
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
              <Button variant="ghost" size="sm" className="p-2" disabled>
                <Bold className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2" disabled>
                <Italic className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2" disabled>
                <ImageIcon className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <Button variant="ghost" size="sm" className="p-2" disabled>
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2" disabled>
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2" disabled>
                <AlignRight className="w-4 h-4" />
              </Button>
              <span className="text-xs text-gray-500 ml-auto">
                Rich text features coming soon
              </span>
            </div>

            {/* Content Area */}
            <Textarea
              placeholder="Write your article content here..."
              value={formData.content}
              onChange={handleContentChange}
              className="min-h-96 border-0 resize-none focus-visible:ring-0 text-base"
              disabled={isLoading}
            />
          </div>

          {/* Word Count and Error */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">{wordCount} Words</span>
            {errors.content && (
              <span className="text-sm text-red-500">{errors.content}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/articles">
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={isLoading}
          >
            Preview
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Article"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
