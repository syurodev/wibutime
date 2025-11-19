# Queries Layer

Server-side data fetching functions for Next.js Server Components.

## Usage

```tsx
// app/genres/page.tsx (Server Component)
import { getGenres } from "@/lib/api/queries/genre";

export default async function GenresPage() {
  const { items, total_pages } = await getGenres({ page: 1, limit: 20 });

  return (
    <div>
      {items.map(genre => (
        <div key={genre.id}>{genre.name}</div>
      ))}
    </div>
  );
}
```

## Features

- ✅ Automatic request deduplication via React `cache()`
- ✅ Built-in Next.js caching with `revalidate` and `tags`
- ✅ Type-safe with Zod schema validation
- ✅ Automatic error handling
- ✅ Session-based authentication

## Available Queries

### User
- `getUserSettings()` - Get user settings

### Content
- `getFeaturedContent()` - Get featured content
- `getFeaturedContentList()` - Get featured carousel
- `getTrendingContent(params?)` - Get trending
- `getLatestContent(params?)` - Get latest
- `getNewContent(params?)` - Get new
- `getPopularContent(params?)` - Get popular
- `getUserLibrary(params?)` - Get user library
- `getContentById(id)` - Get by ID

### Genre
- `getGenres(params?)` - List with pagination
- `getGenreById(id)` - Get by ID

### Author
- `getAuthors(params?)` - List with pagination
- `getAuthorById(id)` - Get by ID

### Artist
- `getArtists(params?)` - List with pagination
- `getArtistById(id)` - Get by ID

### History
- `getRecentHistory(params?)` - Recent history
- `getHistory(params?)` - Paginated history
- `getHistoryById(id)` - Get by ID

### Community
- `getTopCreators(params?)` - Top creators
- `getGenreStats(params?)` - Genre statistics
- `getRisingGenres(params?)` - Rising genres
- `getMilestones(params?)` - Milestones

## Architecture

Each query file follows this pattern:

```tsx
import { cache } from "react";
import { serverApi } from "@/lib/api/server";
import { endpoint } from "@/lib/api/utils/endpoint";

export const getItems = cache(async (params?) => {
  const url = endpoint("items", params || {});

  const response = await serverApi.get(url, {
    next: {
      revalidate: 300, // Cache 5 minutes
      tags: ["items"],
    },
  });

  if (!isSuccessResponse(response)) {
    throw new Error(response.message);
  }

  return ApiParser.parseResponseArray(ItemArraySchema, response);
});
```

## Cache Strategy

- **Featured content**: 5 minutes (`revalidate: 300`)
- **Lists (genres, authors, etc.)**: 5 minutes (`revalidate: 300`)
- **User-specific data**: 1 minute (`revalidate: 60`)
- **Individual items**: 5 minutes (`revalidate: 300`)

Tags allow cache invalidation when data changes via Server Actions.

## Error Handling

Queries throw errors automatically when:
- Network request fails
- Response is not successful
- Schema validation fails

Handle in error boundaries or try-catch:

```tsx
try {
  const genres = await getGenres();
} catch (error) {
  console.error("Failed to fetch genres:", error);
}
```
