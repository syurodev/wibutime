"use client";

import { BlockSelectionPlugin } from "@platejs/selection/react";

export const SelectionKit = [
  BlockSelectionPlugin.configure({
    options: {
      enableContextMenu: true,
    },
  }),
];
