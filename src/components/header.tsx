import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between p-6 bg-white border-b">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <span className="font-semibold text-lg">Logoipsum</span>
      </Link>

      <Link href="/profile">
        <Avatar className="w-8 h-8 bg-blue-200">
          <AvatarFallback className="text-blue-800 font-medium">
            J
          </AvatarFallback>
        </Avatar>
      </Link>
    </header>
  );
}
