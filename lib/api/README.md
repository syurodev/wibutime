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
NEXT_PUBLIC_API_URL=https://api.example.com/v1
```

#### Step 2: Implement Authentication trong `lib/api/config.ts`

```typescript
export async function getAuthToken(): Promise<string | null> {
  // Example: Read from cookies
  const { cookies } = await import("next/headers");
  const token = (await cookies()).get("auth_token")?.value;
  return token || null;

  // Example: Use NextAuth
  // const session = await getServerSession();
  // return session?.accessToken || null;
}
```

---

### 2. Tạo Model

Models map dữ liệu từ API response sang domain objects với computed properties.

#### Example: `lib/api/models/post.ts`

```typescript
import { BaseModel } from "./base";

// Raw data từ API
export interface PostRaw {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  is_published: boolean;
}

// Domain model
export class Post extends BaseModel<PostRaw> {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly authorId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly viewCount: number;
  readonly isPublished: boolean;

  constructor(raw: PostRaw) {
    super(raw);

    // Map properties (snake_case → camelCase)
    this.id = raw.id;
    this.title = raw.title;
    this.content = raw.content;
    this.authorId = raw.author_id;
    this.viewCount = raw.view_count;
    this.isPublished = raw.is_published;

    // Parse dates
    this.createdAt = new Date(raw.created_at);
    this.updatedAt = new Date(raw.updated_at);
  }

  // Computed properties
  get excerpt(): string {
    return this.content.substring(0, 150) + "...";
  }

  get readingTime(): number {
    const wordsPerMinute = 200;
    const words = this.content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
}
```

---

### 3. Tạo Service

Services organize API calls theo domain.

#### Example: `lib/api/services/posts.ts`

```typescript
import { apiClient } from "../client";
import { Post, type PostRaw } from "../models/post";
import { isSuccessResponse, type PaginatedResponse } from "../types";

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
  static async list(params?: ListPostsParams): Promise<PaginatedResponse<Post>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.author_id) searchParams.set("author_id", params.author_id);
    if (params?.is_published !== undefined)
      searchParams.set("is_published", params.is_published.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/posts?${query}` : "/posts";

    const response = await apiClient.get<PostRaw[]>(endpoint, {
      next: {
        revalidate: 60, // Cache 60s
        tags: ["posts"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message);
    }

    const posts = Post.fromApiArray(response.data);

    return {
      items: posts,
      meta: response.meta || {
        page: 1,
        limit: 10,
        total_items: posts.length,
        total_pages: 1,
      },
    };
  }

  /**
   * Get post by ID
   */
  static async getById(id: string): Promise<Post> {
    const response = await apiClient.get<PostRaw>(`/posts/${id}`, {
      next: {
        revalidate: 30,
        tags: [`post-${id}`],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message);
    }

    return Post.fromApi(response.data);
  }
}
```

---

### 4. Gọi API trong Server Components

#### Example: `app/[locale]/(main)/posts/page.tsx`

```tsx
import { PostsService } from "@/lib/api/services/posts";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Await searchParams (Next.js 15+)
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  // Fetch data (với caching tự động)
  const { items: posts, meta } = await PostsService.list({
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
          <p>{post.excerpt}</p>
          <small>
            {post.readingTime} min read • {post.viewCount} views
          </small>
        </article>
      ))}

      <Pagination currentPage={meta.page} totalPages={meta.total_pages} />
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
