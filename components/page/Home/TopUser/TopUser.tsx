"use client";
import React, { useState } from "react";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopUser from "@/components/shared/User/TopUser";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AnimatePresence } from "framer-motion";
import DivSlide from "@/components/shared/Animation/DivSlide";

type IProps = {
  data: {
    daily: TopUser[];
    weekly: TopUser[];
    monthly: TopUser[];
    all: TopUser[];
  };
};

type TierType = "daily" | "weekly" | "monthly" | "all";

const TopUsers: React.FC<IProps> = ({ data }) => {
  const [contentType, setContentType] = useState<TierType>("daily");

  return (
    <DivSlide
      delay={0.6}
      className="rounded-xl border bg-card text-card-foreground shadow transition-colors duration-300 flex-none relative h-fit"
    >
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
      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-hidden">
        <AnimatePresence mode="wait">
          {contentType === "daily"
            ? data.daily.map((item, index) => (
                <DivSlide
                  key={`top-user-${contentType}-${item.id}`}
                  delay={0.05 + index / 15}
                >
                  <TopUser userData={item} index={index} />
                </DivSlide>
              ))
            : contentType === "weekly"
            ? data.weekly.map((item, index) => (
                <DivSlide
                  key={`top-user-${contentType}-${item.id}`}
                  delay={0.05 + index / 15}
                >
                  <TopUser userData={item} index={index} />
                </DivSlide>
              ))
            : contentType === "monthly"
            ? data.monthly.map((item, index) => (
                <DivSlide
                  key={`top-user-${contentType}-${item.id}`}
                  delay={0.05 + index / 15}
                >
                  <TopUser userData={item} index={index} />
                </DivSlide>
              ))
            : contentType === "all"
            ? data.all.map((item, index) => (
                <DivSlide
                  key={`top-user-${contentType}-${item.id}`}
                  delay={0.05 + index / 15}
                >
                  <TopUser userData={item} index={index} />
                </DivSlide>
              ))
            : null}
        </AnimatePresence>
      </CardContent>
    </DivSlide>
  );
};

export default TopUsers;
