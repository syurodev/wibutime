"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp } from "lucide-react";
import { useHomeData } from "./home-data-provider";

export function RisingStarsList() {
  const { rising_stars } = useHomeData();

  if (!rising_stars.length) return null;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <div className="rounded-md bg-yellow-500/10 p-2 text-yellow-500">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Ngôi Sao Mới (Rising Stars)
          </h2>
          <p className="text-sm text-muted-foreground">
            New creators gaining traction in last 90 days
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {rising_stars.map((creator) => (
          <Card
            key={creator.id}
            className="group relative overflow-hidden border-none bg-gradient-to-br from-muted/50 to-muted/10"
          >
            <div className="absolute right-2 top-2">
              <Badge
                variant="outline"
                className="border-yellow-500/50 text-yellow-600 bg-yellow-500/5"
              >
                New
              </Badge>
            </div>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl mb-4 group-hover:scale-105 transition-transform">
                <AvatarImage src={creator.avatar_url || ""} />
                <AvatarFallback>{creator.display_name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg">{creator.display_name}</h3>
              <p className="text-xs text-muted-foreground mb-4">
                @{creator.username}
              </p>

              <div className="grid grid-cols-2 gap-4 w-full bg-background/50 rounded-lg p-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Views
                  </span>
                  <span className="font-mono font-bold">
                    {creator.total_views}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Works</span>
                  <span className="font-mono font-bold">
                    {creator.works_count}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
