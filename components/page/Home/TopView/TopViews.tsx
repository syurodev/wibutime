"use client";

import React, { useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const TopViews = () => {
  const [contentType, setContentType] = useState<ContentType>("anime");

  return (
    <div>
      <div>
        <h2>Top Views</h2>
        <div>
          <ToggleGroup
            type="single"
            // defaultValue={contentType}
            value={contentType}
            onValueChange={(e) =>
              setContentType(!e ? "anime" : (e as ContentType))
            }
          >
            <ToggleGroupItem
              value="anime"
              aria-label="Toggle anime"
              className="rounded-full"
            >
              Anime
            </ToggleGroupItem>
            <ToggleGroupItem
              value="manga"
              aria-label="Toggle manga"
              className="rounded-full"
            >
              Manga
            </ToggleGroupItem>
            <ToggleGroupItem
              value="lightnovel"
              aria-label="Toggle lightnovel"
              className="rounded-full"
            >
              Lightnovel
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};

export default TopViews;
