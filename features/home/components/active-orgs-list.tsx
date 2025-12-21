"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useHomeData } from "./home-data-provider";

export function ActiveOrgsList() {
  const { active_organizations } = useHomeData();

  if (!active_organizations.length) return null;

  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-bold tracking-tight">
        Top Organization Năng Nổ
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {active_organizations.map((org) => (
          <Card
            key={org.id}
            className="flex items-center gap-4 border-l-4 border-l-primary p-4 transition-all hover:bg-muted/40"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={org.avatar_url} />
              <AvatarFallback>{org.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{org.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{org.member_count} members</span>
                <span className="text-primary">
                  • {org.total_activity} activities
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
