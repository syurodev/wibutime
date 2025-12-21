"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";
import { useHomeData } from "./home-data-provider";

export function ActiveCreatorsList() {
  const { most_active_creators } = useHomeData();

  if (!most_active_creators.length) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">
          Top Creator Chăm Chỉ
        </h2>
        <Badge variant="secondary" className="font-mono text-xs">
          Last 30 Days
        </Badge>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-lg">
        <div className="flex w-max space-x-4 pb-4">
          {most_active_creators.map((creator, i) => (
            <Card
              key={creator.id}
              className={cn(
                "w-[200px] shrink-0 overflow-hidden border-none bg-muted/40 transition-all hover:bg-muted/60",
                i === 0 &&
                  "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
            >
              <CardContent className="flex flex-col items-center gap-3 p-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-background">
                    <AvatarImage src={creator.avatar_url || ""} />
                    <AvatarFallback>{creator.display_name[0]}</AvatarFallback>
                  </Avatar>
                  {i < 3 && (
                    <div className="absolute -right-1 -top-1 rounded-full bg-primary p-1 text-primary-foreground">
                      <Trophy className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-semibold truncate w-full max-w-[170px]">
                    {creator.display_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {creator.works_count} posts
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
