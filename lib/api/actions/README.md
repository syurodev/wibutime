# Actions Layer

Server Actions for mutations (create, update, delete) in Next.js Client Components.

## Usage

```tsx
// components/create-genre-form.tsx (Client Component)
"use client";

import { createGenre } from "@/lib/api/actions/genre";
import { useState } from "react";

export function CreateGenreForm() {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const genre = await createGenre({ name });
      console.log("Created:", genre);
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  );
}
```

## Features

- ✅ Server-side execution with `"use server"` directive
- ✅ Automatic cache invalidation via `revalidateTag()`
- ✅ Session-based authentication
- ✅ Type-safe with Zod schema validation
- ✅ Automatic error handling

## Available Actions

### User
- `updateUserSettings(data)` - Update settings
- `resetUserSettings()` - Reset to defaults

### Content
- `createContent(data)` - Create content
- `updateContent(id, data)` - Update content
- `deleteContent(id)` - Delete content
- `addToFavorites(contentId)` - Add to favorites
- `removeFromFavorites(contentId)` - Remove from favorites

### Genre
- `createGenre(data)` - Create genre
- `updateGenre(id, data)` - Update genre
- `deleteGenre(id)` - Delete genre

### Author
- `createAuthor(data)` - Create author
- `updateAuthor(id, data)` - Update author
- `deleteAuthor(id)` - Delete author

### Artist
- `createArtist(data)` - Create artist
- `updateArtist(id, data)` - Update artist
- `deleteArtist(id)` - Delete artist

### History
- `updateHistory(data)` - Add/update history
- `deleteHistory(id)` - Delete history
- `clearHistory()` - Clear all history

## Architecture

Each action file follows this pattern:

```tsx
"use server";

import { updateTag } from "next/cache";
import { serverApi } from "@/lib/api/server";
import { endpoint } from "@/lib/api/utils/endpoint";

export async function createItem(data: CreateItemData) {
  const url = endpoint("items");

  const response = await serverApi.post<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message);
  }

  // Immediately expire cache
  updateTag("items");

  return ApiParser.parse(ItemSchema, response);
}
```

## Cache Invalidation

Actions use `updateTag` (Next.js 16+) to immediately expire caches:

```tsx
// After creating a genre
updateTag("genres"); // Immediately expires genre list cache

// After updating genre 123
updateTag("genres");
updateTag("genre-123"); // Immediately expires specific genre cache
```

**Why `updateTag` instead of `revalidateTag`?**
- `updateTag`: Immediately expires cache (for read-your-own-writes in Server Actions)
- `revalidateTag`: Stale-while-revalidate (for background updates)

This ensures users see their changes immediately after mutations.

## Error Handling

Actions throw errors automatically when:
- Network request fails
- Response is not successful
- Schema validation fails

Handle in try-catch:

```tsx
try {
  await createGenre({ name: "Fantasy" });
} catch (error) {
  // Show error message to user
  setError(error.message);
}
```

## With React Hook Form

```tsx
"use client";

import { useForm } from "react-hook-form";
import { createGenre } from "@/lib/api/actions/genre";

export function CreateGenreForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    await createGenre(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      <button type="submit">Create</button>
    </form>
  );
}
```

## With useTransition

For pending states:

```tsx
"use client";

import { useTransition } from "react";
import { createGenre } from "@/lib/api/actions/genre";

export function CreateGenreButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await createGenre({ name: "Fantasy" });
    });
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? "Creating..." : "Create Genre"}
    </button>
  );
}
```
