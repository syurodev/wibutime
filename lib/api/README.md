# API Service Layer Documentation

Hệ thống tập trung để gọi API trong Next.js 16 với **model mapping**, **type-safety**, **caching**, và **authentication**.

## 📋 Mục Lục

- [Kiến Trúc](#kiến-trúc)
- [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
- [Hướng Dẫn Sử Dụng](#hướng-dẫn-sử-dụng)
  - [1. Cấu Hình API](#1-cấu-hình-api)
  - [2. Tạo Model](#2-tạo-model)
  - [3. Tạo Service](#3-tạo-service)
  - [4. Gọi API trong Server Components](#4-gọi-api-trong-server-components)
  - [5. Mutations với Server Actions](#5-mutations-với-server-actions)
- [Best Practices](#best-practices)
- [Error Handling](#error-handling)
- [Caching Strategy](#caching-strategy)

---

## Kiến Trúc

```
┌─────────────────────────────────────────────┐
│         Server Components / Pages           │
│  (Fetching data, rendering UI)              │
└────────────────┬────────────────────────────┘
                 │
                 ├─── Read (GET)
                 │    └─→ Services (users.ts, posts.ts)
                 │         └─→ API Client
                 │              └─→ External API
                 │
                 └─── Write (POST/PUT/DELETE)
                      └─→ Server Actions (user-actions.ts)
                           └─→ Services
                                └─→ API Client
                                     └─→ External API

┌─────────────────────────────────────────────┐
│              Response Flow                   │
└─────────────────────────────────────────────┘

External API Response (JSON)
  ↓
StandardResponse<UserRaw>
  {
    success: true,
    data: { id: "1", first_name: "John", ... },
    meta: { page: 1, ... }
  }
  ↓
Model Mapping (User.fromApi)
  ↓
User Model Instance
  {
    id: "1",
    firstName: "John",      ← snake_case → camelCase
    fullName: "John Doe",   ← computed property
    isAdmin: false,         ← computed property
    ...
  }
  ↓
Used in Components (type-safe)
```

---

## Cấu Trúc Thư Mục

```
lib/
├── api/
│   ├── types/
│   │   ├── response.ts          # StandardResponse, PaginationMeta, type guards
│   │   ├── error.ts             # Custom error classes
│   │   └── index.ts
│   ├── models/
│   │   ├── base.ts              # BaseModel class, mapping utilities
│   │   ├── user.ts              # Example: User model
│   │   └── index.ts
│   ├── services/
│   │   ├── users.ts             # Example: Users API service
│   │   └── index.ts
│   ├── client.ts                # API client (fetch wrapper)
│   ├── config.ts                # API configuration
│   └── README.md                # This file
└── actions/
    └── user-actions.ts          # Example: User mutations
```

---

## Hướng Dẫn Sử Dụng

### 1. Cấu Hình API

#### Step 1: Cập nhật `.env.local`

```env
# API Base URL
NEXT_PUBLIC_API_URL=https://api.example.com/v1

# Use mock API (development)
NEXT_PUBLIC_USE_MOCK_API=true

# Enable API debug logging
NEXT_PUBLIC_API_DEBUG=true
```

#### Step 2: Authentication

Authentication được xử lý tự động qua `lib/api/auth.ts`:

**Client-side** (trong Client Components):
```typescript
import { createAuthenticatedClient } from "@/lib/api/client-auth";

// Auto-detect token from localStorage
const client = createAuthenticatedClient();
const data = await client.get("/users");

// Or pass token explicitly
const client = createAuthenticatedClient(token);
```

**Server-side** (trong Server Components):
```typescript
import { serverApi } from "@/lib/api/server";

// Auto-detect session token
const data = await serverApi.get("/users");
```

---

### 2. Tạo Model

Models sử dụng **Zod schemas** cho runtime validation và type-safety.

#### Example: `lib/api/models/post.ts`

```typescript
import { z } from "zod";

/**
 * Post Zod Schema
 * Auto-validates API responses và provides default values
 */
export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  author_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  view_count: z.number().default(0),
  is_published: z.boolean().default(false),
});

/**
 * TypeScript type tự động generate từ schema
 */
export type Post = z.infer<typeof PostSchema>;

/**
 * Utilities for Post model
 */
export const PostUtils = {
  /**
   * Safe parse post data từ API
   */
  parse(data: unknown): Post {
    return PostSchema.parse(data);
  },

  /**
   * Safe parse với fallback
   */
  safeParse(data: unknown): Post | null {
    const result = PostSchema.safeParse(data);
    return result.success ? result.data : null;
  },

  /**
   * Computed: Get excerpt from content
   */
  getExcerpt(post: Post, maxLength = 150): string {
    return post.content.substring(0, maxLength) + "...";
  },

  /**
   * Computed: Calculate reading time
   */
  getReadingTime(post: Post): number {
    const wordsPerMinute = 200;
    const words = post.content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  },
};
```

**Benefits của Zod approach:**
- ✅ Runtime validation tự động
- ✅ Default values cho missing fields
- ✅ Type inference (không cần viết interface riêng)
- ✅ Composable schemas (dễ reuse)
- ✅ Built-in error messages

---

### 3. Tạo Service

Services organize API calls theo domain và sử dụng `ApiParser` cho validation.

#### Example: `lib/api/services/posts.ts`

```typescript
import { API_CONFIG } from "../config";
import { apiClient } from "../client";
import { Post, PostSchema } from "../models/post";
import { ApiParser } from "../utils/parsers";
import { isSuccessResponse, type StandardResponse } from "../types";

export interface ListPostsParams {
  page?: number;
  limit?: number;
  author_id?: string;
  is_published?: boolean;
}

export class PostsService {
  /**
   * Get all posts with pagination
   */
  static async list(params?: ListPostsParams): Promise<{
    items: Post[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    // Build query params
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.author_id) searchParams.set("author_id", params.author_id);
    if (params?.is_published !== undefined)
      searchParams.set("is_published", params.is_published.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/posts?${query}` : "/posts";

    // Fetch với caching
    const response = await apiClient.get<Post[]>(endpoint, {
      next: {
        revalidate: 60, // Cache 60s
        tags: ["posts"],
      },
    });

    // Validate response
    if (!isSuccessResponse(response)) {
      throw new Error(response.message);
    }

    // Parse và validate data với Zod schema
    const posts = ApiParser.parseResponseArray(PostSchema, response);

    return {
      items: posts,
      totalItems: response.meta?.total_items || posts.length,
      totalPages: response.meta?.total_pages || 1,
      currentPage: response.meta?.page || 1,
    };
  }

  /**
   * Get post by ID
   */
  static async getById(id: string): Promise<Post> {
    const response = await apiClient.get<Post>(`/posts/${id}`, {
      next: {
        revalidate: 30,
        tags: [`post-${id}`],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message);
    }

    // Parse và validate single item
    return ApiParser.parse(PostSchema, response);
  }
}
```

---

### 4. Gọi API trong Server Components

#### Example: `app/[locale]/(main)/posts/page.tsx`

```tsx
import { PostsService } from "@/lib/api/services/posts";
import { PostUtils } from "@/lib/api/models/post";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Await searchParams (Next.js 15+)
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  // Fetch data (với caching tự động)
  const { items: posts, totalPages, currentPage } = await PostsService.list({
    page,
    limit: 20,
    is_published: true,
  });

  return (
    <div>
      <h1>Posts</h1>

      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{PostUtils.getExcerpt(post)}</p>
          <small>
            {PostUtils.getReadingTime(post)} min read • {post.view_count} views
          </small>
        </article>
      ))}

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
```

#### Example: Loading State

```tsx
// app/[locale]/(main)/posts/loading.tsx
export default function Loading() {
  return <div>Loading posts...</div>;
}
```

---

### 5. Mutations với Server Actions

#### Step 1: Tạo Server Action

`lib/actions/post-actions.ts`:

```typescript
"use server";

import { revalidateTag } from "next/cache";
import { PostsService } from "../api/services/posts";

export async function createPost(data: {
  title: string;
  content: string;
}) {
  try {
    const post = await PostsService.create(data);

    // Revalidate cache
    revalidateTag("posts");

    return { success: true, data: { id: post.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

#### Step 2: Sử dụng trong Client Component

```tsx
"use client";

import { createPost } from "@/lib/actions/post-actions";
import { toast } from "sonner";

export function CreatePostForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createPost({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    });

    if (result.success) {
      toast.success("Post created!");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

---

## Best Practices

### ✅ DO

1. **Luôn map data qua Models** - Để có type-safe và computed properties
   ```typescript
   const users = User.fromApiArray(response.data); // ✅
   ```

2. **Sử dụng type guards**
   ```typescript
   if (isSuccessResponse(response)) {
     const user = User.fromApi(response.data); // ✅ Type-safe
   }
   ```

3. **Tag caching cho revalidation**
   ```typescript
   next: {
     tags: ["users", `user-${id}`], // ✅ Easy invalidation
   }
   ```

4. **Handle errors properly**
   ```typescript
   catch (error) {
     if (error instanceof ValidationError) {
       // Handle validation
     } else if (error instanceof ApiError) {
       // Handle API error
     }
   }
   ```

### ❌ DON'T

1. **Không sử dụng raw data trực tiếp**
   ```typescript
   const users = response.data; // ❌ No mapping
   ```

2. **Không hardcode cache times mà không suy nghĩ**
   ```typescript
   revalidate: 9999999, // ❌ Too long
   revalidate: 0,       // ❌ No caching (slow)
   ```

3. **Không skip error handling**
   ```typescript
   const user = await UsersService.getById(id); // ❌ No try-catch
   ```

---

## Error Handling

### Error Types

```typescript
import {
  ApiError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  NetworkError,
} from "@/lib/api/types";
```

### Example: Comprehensive Error Handling

```typescript
try {
  const user = await UsersService.getById(id);
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Redirect to login
    redirect("/login");
  } else if (error instanceof AuthorizationError) {
    // Show access denied
    return <AccessDenied />;
  } else if (error instanceof NotFoundError) {
    // Show 404
    notFound();
  } else if (error instanceof ValidationError) {
    // Show validation errors
    return <ValidationErrors errors={error.errors} />;
  } else if (error instanceof NetworkError) {
    // Show network error
    return <NetworkError />;
  } else {
    // Generic error
    throw error;
  }
}
```

---

## Caching Strategy

### Recommended Cache Times

| Data Type | Revalidate | Reasoning |
|-----------|-----------|-----------|
| User profile | 30s | Changes occasionally |
| Post list | 60s | Updated frequently but OK with stale data |
| Post detail | 120s | Content doesn't change often |
| Search results | 120s | Can be stale |
| Current user | 0 | Always fresh |
| Static content | `false` | Never revalidate |

### Cache Tags Strategy

```typescript
// Tag by resource type
tags: ["users"]           // All users
tags: ["posts"]           // All posts

// Tag by specific ID
tags: [`user-${id}`]      // Specific user
tags: [`post-${id}`]      // Specific post

// Tag by relation
tags: ["current-user"]    // Current authenticated user
tags: [`user-${id}-posts`] // Posts by user
```

### Revalidation

```typescript
import { revalidateTag } from "next/cache";

// Revalidate all users
revalidateTag("users");

// Revalidate specific user
revalidateTag(`user-${id}`);

// Revalidate multiple
revalidateTag("posts");
revalidateTag(`user-${authorId}-posts`);
```

---

## Advanced Usage

### Nested Models

```typescript
export class Comment extends BaseModel<CommentRaw> {
  readonly author: User; // Nested model

  constructor(raw: CommentRaw) {
    super(raw);
    // Map nested user
    this.author = User.fromApi(raw.author);
  }
}
```

### Nullable Nested Models

```typescript
import { mapNullable } from "./base";

export class Post extends BaseModel<PostRaw> {
  readonly author: User | null;

  constructor(raw: PostRaw) {
    super(raw);
    this.author = mapNullable(raw.author, User);
  }
}
```

### Array of Nested Models

```typescript
import { mapArray } from "./base";

export class Post extends BaseModel<PostRaw> {
  readonly comments: Comment[];

  constructor(raw: PostRaw) {
    super(raw);
    this.comments = mapArray(raw.comments, Comment);
  }
}
```

---

## Troubleshooting

### Issue: API không được cache

**Solution**: Kiểm tra `next.revalidate` option:

```typescript
const response = await apiClient.get<UserRaw>("/users", {
  next: { revalidate: 60 }, // ✅ Add this
});
```

### Issue: Token không được gửi lên API

**Solution**: Implement `getAuthToken()` trong `config.ts`:

```typescript
export async function getAuthToken(): Promise<string | null> {
  const { cookies } = await import("next/headers");
  return (await cookies()).get("token")?.value || null;
}
```

### Issue: Type errors với Models

**Solution**: Đảm bảo extend `BaseModel` đúng cách:

```typescript
export class User extends BaseModel<UserRaw> { // ✅
  constructor(raw: UserRaw) {
    super(raw); // ✅ Call super
    // ...
  }
}
```

---

## Example: Complete Flow

```typescript
// 1. Define raw type
interface UserRaw {
  id: string;
  email: string;
  created_at: string;
}

// 2. Create model
class User extends BaseModel<UserRaw> {
  readonly id: string;
  readonly email: string;
  readonly createdAt: Date;

  constructor(raw: UserRaw) {
    super(raw);
    this.id = raw.id;
    this.email = raw.email;
    this.createdAt = new Date(raw.created_at);
  }
}

// 3. Create service
class UsersService {
  static async getById(id: string): Promise<User> {
    const response = await apiClient.get<UserRaw>(`/users/${id}`);
    if (!isSuccessResponse(response)) throw new Error(response.message);
    return User.fromApi(response.data);
  }
}

// 4. Use in Server Component
export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await UsersService.getById(id);

  return <div>{user.email}</div>;
}

// 5. Mutations via Server Action
"use server";
export async function updateUser(id: string, data: UpdateUserParams) {
  const user = await UsersService.update(id, data);
  revalidateTag(`user-${id}`);
  return { success: true, data: { id: user.id } };
}
```

---

Cần thêm thông tin hoặc có câu hỏi? Check `lib/api/services/users.ts` để xem full example!
