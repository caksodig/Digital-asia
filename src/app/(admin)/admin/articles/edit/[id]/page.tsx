"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

const categories = [
  "Technology",
  "Design",
  "Development",
  "Business",
  "Marketing",
];

// Mock article data
const mockArticles = [
  {
    id: 1,
    title: "Cybersecurity Essentials Every Developer Should Know",
    category: "Technology",
    content:
      "In the ever-evolving world of digital product design, collaboration between designers and developers has always been a crucial—yet often challenging—part of the process. In April 2025, Figma introduced Dev Mode, a powerful new feature aimed at streamlining that collaboration more than ever before.",
    thumbnail: "/developer-working-on-cybersecurity-code.png",
  },
  {
    id: 2,
    title: "The Future of Work: Remote-First Teams and Digital Tools",
    category: "Technology",
    content:
      "Remote work has transformed how teams collaborate and build products. This comprehensive guide explores the tools and strategies that make remote-first teams successful.",
    thumbnail: "/remote-team-collaboration-digital-workspace.png",
  },
];

export default function EditArticlePage() {
  const params = useParams();
  const articleId = Number.parseInt(params.id as string);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    thumbnail: null as File | null,
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load article data
    const article = mockArticles.find((a) => a.id === articleId);
    if (article) {
      setFormData({
        title: article.title,
        category: article.category,
        content: article.content,
        thumbnail: null,
      });
      setThumbnailPreview(article.thumbnail);
      setWordCount(article.content.trim().split(/\s+/).filter(Boolean).length);
    }
    setIsLoading(false);
  }, [articleId]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, thumbnail: file });
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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, thumbnail: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Updated article data:", formData);
    // Redirect to articles list or show success message
  };

  const handlePreview = () => {
    // Handle preview functionality
    console.log("Preview article:", formData);
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/articles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit Article
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl">
        {/* Thumbnail Upload */}
        <div className="mb-6">
          <Label className="text-base font-medium mb-3 block">Thumbnails</Label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById("thumbnail-upload")?.click()}
          >
            {thumbnailPreview ? (
              <div className="relative">
                <Image
                  src={thumbnailPreview || "/placeholder.svg"}
                  alt="Thumbnail preview"
                  width={200}
                  height={120}
                  className="mx-auto rounded object-cover"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    setThumbnailPreview(null);
                    setFormData({ ...formData, thumbnail: null });
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to select files</p>
                <p className="text-sm text-gray-500">
                  Support File Type : jpg or png
                </p>
              </div>
            )}
            <input
              id="thumbnail-upload"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleThumbnailChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <Label htmlFor="title" className="text-base font-medium mb-3 block">
            Title
          </Label>
          <Input
            id="title"
            placeholder="Input title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="text-base"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <Label className="text-base font-medium mb-3 block">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-2">
            The existing category list can be seen in the{" "}
            <Link
              href="/admin/category"
              className="text-blue-600 hover:underline"
            >
              category
            </Link>{" "}
            menu
          </p>
        </div>

        {/* Rich Text Editor */}
        <div className="mb-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
              <Button variant="ghost" size="sm" className="p-2">
                <Bold className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Italic className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <ImageIcon className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <Button variant="ghost" size="sm" className="p-2">
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Content Area */}
            <Textarea
              placeholder="Type a content..."
              value={formData.content}
              onChange={handleContentChange}
              className="min-h-96 border-0 resize-none focus-visible:ring-0 text-base"
            />
          </div>

          {/* Word Count */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">{wordCount} Words</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/articles">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button variant="outline" onClick={handlePreview}>
            Preview
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
