"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/components/store/auth";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function ProfilePage() {
  const { user, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (!user) {
      fetchProfile(); // ambil user profile dari backend pakai token
    }
  }, [user, fetchProfile]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-6 max-w-md">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-8">User Profile</h1>

                {/* Avatar */}
                <Avatar className="w-20 h-20 mx-auto mb-8 bg-blue-200">
                  <AvatarFallback className="text-blue-800 font-semibold text-2xl">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span className="font-medium">Username</span>
                    <span className="text-muted-foreground">
                      {user.username}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span className="font-medium">Role</span>
                    <span className="text-muted-foreground">{user.role}</span>
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
