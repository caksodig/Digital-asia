import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  date: string;
  tags: string[];
}

export function ArticleCard({
  slug,
  title,
  excerpt,
  imageUrl,
  date,
  tags,
}: ArticleCardProps) {
  return (
    <Link href={`/articles/${slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video relative">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-2">{date}</p>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {excerpt}
          </p>
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
