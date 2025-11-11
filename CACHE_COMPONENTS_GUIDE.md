# Cache Components Setup Guide

## Overview

WibuTime home page has been optimized with Next.js 16 Cache Components for improved performance and user experience.

## What is Cache Components?

Cache Components implements **Partial Prerendering (PPR)** - a new approach to rendering that gives you the best of both static and dynamic rendering:

- **Fast initial load**: Static shell sent immediately
- **Fresh data**: Dynamic content streams in as ready
- **Fine-grained caching**: Control what gets cached and when

## Implementation

### 1. Configuration (`next.config.ts`)

```typescript
cacheComponents: true  // Enable Cache Components

// Custom cache profiles for different content types
cacheLife: {
  featured: { stale: 5min, revalidate: 15min, expire: 1hr }
  trending: { stale: 5min, revalidate: 10min, expire: 1hr }
  latest: { stale: 3min, revalidate: 5min, expire: 30min }
  newSeries: { stale: 10min, revalidate: 30min, expire: 2hr }
}
```

### 2. Cached Functions (`lib/api/services/content.cached.ts`)

Created wrapper functions with `use cache` directive:

```typescript
export async function getCachedFeaturedList() {
  'use cache'
  cacheTag('featured')
  cacheLife('featured')

  return await ContentService.getFeaturedList()
}
```

Each function:
- Uses `use cache` directive
- Tagged for cache invalidation (`cacheTag`)
- Configured with appropriate cache duration (`cacheLife`)

### 3. Suspense Boundaries (`app/[locale]/(main)/page.tsx`)

Home page split into streaming sections:

```typescript
<Suspense fallback={<SectionSkeleton />}>
  <CachedTrendingSection />
</Suspense>
```

Each section:
- Renders independently
- Shows skeleton while loading
- Streams in when ready
- Cached according to its profile

## Cache Strategy

### Featured Content
- **Stale**: 5 minutes
- **Revalidate**: 15 minutes (background refresh)
- **Expire**: 1 hour
- **Rationale**: Hero carousel changes infrequently

### Trending Series
- **Stale**: 5 minutes
- **Revalidate**: 10 minutes
- **Expire**: 1 hour
- **Rationale**: Based on views, needs moderate freshness

### Latest Updates
- **Stale**: 3 minutes
- **Revalidate**: 5 minutes
- **Expire**: 30 minutes
- **Rationale**: Should be relatively fresh for best UX

### New Series
- **Stale**: 10 minutes
- **Revalidate**: 30 minutes
- **Expire**: 2 hours
- **Rationale**: Doesn't change as frequently

## Benefits

### Performance
- ✅ Instant page loads with static shell
- ✅ Reduced server load with intelligent caching
- ✅ Parallel data fetching with streaming

### User Experience
- ✅ Fast First Contentful Paint (FCP)
- ✅ Progressive enhancement as content streams in
- ✅ Smooth skeleton → content transitions

### Developer Experience
- ✅ Fine-grained control over caching
- ✅ Easy cache invalidation with tags
- ✅ Clear separation of concerns

## Cache Invalidation

To manually invalidate cache:

```typescript
// In a Server Action
import { revalidateTag } from 'next/cache'

export async function updateContent() {
  'use server'

  // Update data...

  // Invalidate specific cache
  revalidateTag('trending')

  // Or multiple tags
  revalidateTag('latest')
  revalidateTag('new')
}
```

## Monitoring

To verify caching is working:

1. **First visit**: All sections show skeletons briefly
2. **Subsequent visits (within stale time)**: Instant load from cache
3. **After revalidate time**: Background refresh happens
4. **After expire time**: Fresh data fetched on next request

## Testing

```bash
# Start dev server
npm run dev

# Visit homepage: http://localhost:3000

# Observe:
# 1. Initial load shows skeletons (1-2s due to mock delay)
# 2. Sections stream in independently
# 3. Refresh within 5 minutes → instant load
# 4. Wait > 5 minutes → background refresh
```

## Future Enhancements

- [ ] Add real-time cache invalidation on content updates
- [ ] Implement incremental static regeneration for detail pages
- [ ] Add cache analytics and monitoring
- [ ] Optimize cache profiles based on real usage patterns

## References

- [Next.js Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
- [use cache directive](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [cacheLife API](https://nextjs.org/docs/app/api-reference/functions/cacheLife)
- [cacheTag API](https://nextjs.org/docs/app/api-reference/functions/cacheTag)
