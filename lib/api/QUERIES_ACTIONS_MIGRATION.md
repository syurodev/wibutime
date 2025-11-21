# Migration Guide: Services → Queries + Actions

This guide explains how to migrate from the old Services layer to the new Queries + Actions pattern.

## Architecture Overview

### Old Pattern (Services)

```
app/
  └─ components/
      └─ MyComponent.tsx  ──→  Services  ──→  API
```

### New Pattern (Queries + Actions)

```
app/
  ├─ Server Components  ──→  Queries  ──→  API
  └─ Client Components  ──→  Actions  ──→  API
```

## Key Principles

1. **Server Components** → Use **Queries** (data fetching)
2. **Client Components** → Use **Actions** (mutations)
3. **No more Services** - Delete completely after migration

## Migration Examples

### 1. Genre Management

#### Before (Services)

```tsx
// Server Component
import { GenreService } from "@/lib/api/services/admin/genre.service";

export default async function GenresPage() {
  const genres = await GenreService.getGenres({ page: 1, limit: 20 });
  // ...
}
```

```tsx
// Client Component
"use client";
import { GenreService } from "@/lib/api/services/admin/genre.service";

export function CreateGenreForm() {
  const handleSubmit = async (data) => {
    await GenreService.createGenre(data); // ❌ Won't work - no session access
  };
}
```

#### After (Queries + Actions)

```tsx
// Server Component
import { getGenres } from "@/lib/api/queries/genre";

export default async function GenresPage() {
  const genres = await getGenres({ page: 1, limit: 20 });
  // ...
}
```

```tsx
// Client Component
"use client";
import { createGenre } from "@/lib/api/actions/genre";

export function CreateGenreForm() {
  const handleSubmit = async (data) => {
    await createGenre(data); // ✅ Works - Server Action
  };
}
```

### 2. Author Management

#### Before

```tsx
// Server Component
import { AuthorService } from "@/lib/api/services/admin/author.service";

const authors = await AuthorService.getAuthors({ search: "john" });
```

```tsx
// Client Component
"use client";
import { AuthorService } from "@/lib/api/services/admin/author.service";

await AuthorService.updateAuthor(id, { name: "Updated" });
```

#### After

```tsx
// Server Component
import { getAuthors } from "@/lib/api/queries/author";

const authors = await getAuthors({ search: "john" });
```

```tsx
// Client Component
"use client";
import { updateAuthor } from "@/lib/api/actions/author";

await updateAuthor(id, { name: "Updated" });
```

### 3. Artist Management

#### Before

```tsx
import { ArtistService } from "@/lib/api/services/admin/artist.service";

const artists = await ArtistService.getArtists({ page: 1 });
await ArtistService.deleteArtist(id);
```

#### After

```tsx
// Server Component
import { getArtists } from "@/lib/api/queries/artist";
const artists = await getArtists({ page: 1 });

// Client Component
("use client");
import { deleteArtist } from "@/lib/api/actions/artist";
await deleteArtist(id);
```

### 4. Content Management

#### Before

```tsx
import { ContentService } from "@/lib/api/services/base-content/content.service";

const featured = await ContentService.getFeatured();
const trending = await ContentService.getTrending(10);
const latest = await ContentService.getLatestPaginated({
  page: 1,
  type: "anime",
});
```

#### After

```tsx
// Server Component
import {
  getFeaturedContent,
  getTrendingContent,
  getLatestContent,
} from "@/lib/api/queries/content";

const featured = await getFeaturedContent();
const trending = await getTrendingContent({ limit: 10 });
const latest = await getLatestContent({ page: 1, type: "anime" });
```

### 5. User Settings

#### Before

```tsx
import { UserSettingsService } from "@/lib/api/services/user/user-settings.service";

const settings = await UserSettingsService.getSettings();
await UserSettingsService.updateSettings({ theme: "dark" });
```

#### After

```tsx
// Server Component
import { getUserSettings } from "@/lib/api/queries/user";
const settings = await getUserSettings();

// Client Component
("use client");
import { updateUserSettings } from "@/lib/api/actions/user";
await updateUserSettings({ theme: "dark" });
```

### 6. History

#### Before

```tsx
import { HistoryService } from "@/features/history/services/history.service";

const history = await HistoryService.getRecentHistory(12);
const paginated = await HistoryService.getHistoryPaginated({
  type: "anime",
  page: 1,
  sort: "recent",
});
```

#### After

```tsx
// Server Component
import { getRecentHistory, getHistory } from "@/features/history/api/queries";

const history = await getRecentHistory({ limit: 12 });
const paginated = await getHistory({
  type: "anime",
  page: 1,
  sort: "recent",
});
```

### 7. Community

#### Before

```tsx
import { CommunityService } from "@/lib/api/services/community/community.service";

const creators = await CommunityService.getTopCreators(10);
const genreStats = await CommunityService.getGenreStats(12);
const milestones = await CommunityService.getMilestones(6);
```

#### After

```tsx
// Server Component
import {
  getTopCreators,
  getGenreStats,
  getMilestones,
} from "@/lib/api/queries/community";

const creators = await getTopCreators({ limit: 10 });
const genreStats = await getGenreStats({ limit: 12 });
const milestones = await getMilestones({ limit: 6 });
```

## Migration Checklist

### Step 1: Find all Service imports

```bash
# Search for service imports
grep -r "from.*services" app/
```

### Step 2: Identify component type

- **Server Component** → Replace with query
- **Client Component** → Replace with action

### Step 3: Update imports

```tsx
// Before
import { GenreService } from "@/lib/api/services/admin/genre.service";

// After (Server Component)
import { getGenres, getGenreById } from "@/lib/api/queries/genre";

// After (Client Component)
import { createGenre, updateGenre, deleteGenre } from "@/lib/api/actions/genre";
```

### Step 4: Update function calls

- Remove `.Service` class name
- Update method names to new function names
- Adjust parameters if needed (check TypeScript errors)

### Step 5: Test thoroughly

- Check all pages still load correctly
- Test all mutations (create, update, delete)
- Verify caching is working (check Network tab)

## API Reference

### Available Queries

#### User

- `getUserSettings()` - Get user settings

#### Content

- `getFeaturedContent()` - Get featured content
- `getFeaturedContentList()` - Get featured list for carousel
- `getTrendingContent(params?)` - Get trending content
- `getLatestContent(params?)` - Get latest content
- `getNewContent(params?)` - Get new content
- `getPopularContent(params?)` - Get popular content
- `getUserLibrary(params?)` - Get user library
- `getContentById(id)` - Get content by ID

#### Genre

- `getGenres(params?)` - Get genres with pagination
- `getGenreById(id)` - Get genre by ID

#### Author

- `getAuthors(params?)` - Get authors with pagination
- `getAuthorById(id)` - Get author by ID

#### Artist

- `getArtists(params?)` - Get artists with pagination
- `getArtistById(id)` - Get artist by ID

#### History

- `getRecentHistory(params?)` - Get recent history
- `getHistory(params?)` - Get paginated history
- `getHistoryById(id)` - Get history item by ID

#### Community

- `getTopCreators(params?)` - Get top creators
- `getGenreStats(params?)` - Get genre statistics
- `getRisingGenres(params?)` - Get rising genres
- `getMilestones(params?)` - Get community milestones

### Available Actions

#### User

- `updateUserSettings(data)` - Update settings
- `resetUserSettings()` - Reset to defaults

#### Content

- `createContent(data)` - Create content
- `updateContent(id, data)` - Update content
- `deleteContent(id)` - Delete content
- `addToFavorites(contentId)` - Add to favorites
- `removeFromFavorites(contentId)` - Remove from favorites

#### Genre

- `createGenre(data)` - Create genre
- `updateGenre(id, data)` - Update genre
- `deleteGenre(id)` - Delete genre

#### Author

- `createAuthor(data)` - Create author
- `updateAuthor(id, data)` - Update author
- `deleteAuthor(id)` - Delete author

#### Artist

- `createArtist(data)` - Create artist
- `updateArtist(id, data)` - Update artist
- `deleteArtist(id)` - Delete artist

#### History

- `updateHistory(data)` - Add/update history entry
- `deleteHistory(id)` - Delete history entry
- `clearHistory()` - Clear all history

## Benefits

1. **Type Safety** - Better TypeScript inference
2. **Automatic Caching** - React cache deduplicates requests
3. **Cache Invalidation** - Automatic with revalidateTag
4. **Simpler Architecture** - No class-based services
5. **Next.js Native** - Follows official patterns
6. **Better DX** - Clearer separation of concerns

## Troubleshooting

### "Cannot call Server Action from Server Component"

**Solution**: Use queries for Server Components, actions for Client Components

### "Cannot access session in Client Component"

**Solution**: Use Server Actions which run on server and have session access

### "Cache not invalidating"

**Solution**: Check that action calls `revalidateTag()` with correct tag

### "TypeScript errors after migration"

**Solution**: Check parameter types - some function signatures changed slightly

## Next Steps

1. Search for all service imports: `grep -r "services/" app/`
2. Replace with queries/actions as shown above
3. Test each page/component
4. Remove services directory: `rm -rf lib/api/services`
5. Update `lib/api/index.ts` to remove services export
