"use client";
import React, { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopUser from "@/components/shared/User/TopUser";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type IProps = {
  userData: TopUser[];
};

type TierType = "daily" | "weekly" | "monthly" | "all";

const TopUsers: React.FC<IProps> = ({ userData }) => {
  const [contentType, setContentType] = useState<TierType>("daily");

  return (
    <Card>
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle>Top User</CardTitle>
        <ToggleGroup
          type="single"
          // defaultValue={contentType}
          value={contentType}
          onValueChange={(e) => setContentType(!e ? "daily" : (e as TierType))}
          className="!mt-0"
        >
          <ToggleGroupItem
            value="daily"
            aria-label="Toggle daily"
            className="rounded-full !mt-0"
          >
            Daily
          </ToggleGroupItem>
          <ToggleGroupItem
            value="weekly"
            aria-label="Toggle weekly"
            className="rounded-full !mt-0"
          >
            Weekly
          </ToggleGroupItem>
          <ToggleGroupItem
            value="monthly"
            aria-label="Toggle monthly"
            className="rounded-full !mt-0"
          >
            Monthly
          </ToggleGroupItem>
          <ToggleGroupItem
            value="all"
            aria-label="Toggle all"
            className="rounded-full !mt-0"
          >
            All
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {userData &&
          userData.length > 0 &&
          userData.map((user, index) => {
            return (
              <TopUser
                key={`top-user-${user.id}`}
                userData={user}
                index={index}
              />
            );
          })}
      </CardContent>
    </Card>
  );
};

export default TopUsers;
