# API Utilities - Fetch & Error Handling

Hệ thống fetch tập trung với logging và error handling cho WibuTime API.

## Files

- **`fetch.ts`** - Centralized fetch utility với Next.js cache support
- **`error-handler.ts`** - Error handling, logging, và 401 redirect utilities

## Quick Start

### Basic Usage

```typescript
import { api } from "@/lib/api/utils/fetch";

// GET request
const data = await api.get<MyType>("/api/v1/genres");

// POST request
const created = await api.post<Genre>("/api/v1/genres", {
  name: "Fantasy",
  description: "Fantasy genre"
});

// PUT request
const updated = await api.put<Genre>("/api/v1/genres/123", {
  name: "Updated Name"
});

// DELETE request
await api.delete("/api/v1/genres/123");
```

### Advanced Usage

```typescript
import { apiFetch } from "@/lib/api/utils/fetch";

// With custom options
const data = await apiFetch<MyType>("/api/v1/genres", {
  method: "GET",

  // Next.js cache options
  cache: "no-store", // "force-cache" | "no-store" | "reload" ...
  revalidate: 3600, // Revalidate after 1 hour
  tags: ["genres"], // For on-demand revalidation

  // Request options
  headers: {
    "X-Custom-Header": "value"
  },
  token: "custom-token", // Override auth token
  timeout: 10000, // 10 second timeout

  // Get raw Response object
  raw: true,

  // Custom base URL
  baseURL: "https://api.example.com"
});
```

## Features

### 1. Automatic Logging

Tất cả requests/responses được log tự động trong development mode:

```
🔵 API Request: GET http://localhost:8080/api/v1/genres
  Method: GET
  URL: http://localhost:8080/api/v1/genres
  Timestamp: 2025-01-19T10:30:00.000Z

✅ API Response: GET http://localhost:8080/api/v1/genres
  Status: 200
  Data: { ... }
  Timestamp: 2025-01-19T10:30:00.150Z
```

Errors cũng được log chi tiết:

```
🔴 API Error: POST http://localhost:8080/api/v1/genres
  Error: ApiError: Request failed with status 400
  Timestamp: 2025-01-19T10:30:00.000Z
```

### 2. Auto Headers

Headers được tự động thêm vào:

```typescript
// Auto Content-Type for JSON body
await api.post("/genres", { name: "Fantasy" });
// → Content-Type: application/json

// Auto Authorization token from localStorage/sessionStorage
await api.get("/genres");
// → Authorization: Bearer <token>

// FormData auto detection
const formData = new FormData();
formData.append("file", file);
await api.post("/upload", formData);
// → Content-Type: multipart/form-data (with boundary)
```

### 3. 401 Unauthorized Handling

Tự động redirect khi unauthorized:

```typescript
// If API returns 401
await api.get("/protected-route");
// → Clears localStorage/sessionStorage auth tokens
// → Redirects to /login?redirect=/protected-route
```

### 4. Error Types

Custom `ApiError` class với thông tin chi tiết:

```typescript
import { ApiError } from "@/lib/api/utils/error-handler";

try {
  await api.get("/genres");
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.message);    // User-friendly message
    console.log(error.statusCode); // HTTP status code (404, 500, etc.)
    console.log(error.code);       // Backend error code
    console.log(error.details);    // Additional error details
  }
}
```

### 5. Next.js Cache Integration

Hỗ trợ đầy đủ Next.js 14+ caching:

```typescript
// Force cache (good for static data)
const genres = await api.get("/genres", {
  cache: "force-cache"
});

// No cache (always fresh)
const user = await api.get("/user/me", {
  cache: "no-store"
});

// Time-based revalidation
const posts = await api.get("/posts", {
  revalidate: 60 // Revalidate every 60 seconds
});

// Tag-based revalidation
const products = await api.get("/products", {
  tags: ["products"]
});
// Later: revalidateTag("products")
```

### 6. TypeScript Support

Full type safety với generics:

```typescript
interface Genre {
  id: string;
  name: string;
  description: string;
}

// Type-safe response
const genre = await api.get<Genre>("/genres/123");
genre.name // ✅ TypeScript knows this is string

// Type-safe request body
await api.post<Genre>("/genres", {
  name: "Fantasy",
  description: "Fantasy genre"
  // unknown: "field" // ❌ TypeScript error
});
```

### 7. Timeout Support

Prevent long-running requests:

```typescript
try {
  await api.get("/slow-endpoint", {
    timeout: 5000 // 5 second timeout
  });
} catch (error) {
  if (error instanceof ApiError && error.message.includes("timeout")) {
    console.log("Request timed out");
  }
}
```

### 8. Network Error Handling

User-friendly Vietnamese messages:

```typescript
// Network error
await api.get("/genres");
// → "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."

// Timeout error
await api.get("/genres", { timeout: 1000 });
// → "Request timeout. Vui lòng thử lại."
```

## Complete Example

```typescript
import { api, ApiError } from "@/lib/api/utils/fetch";
import type { StandardResponse } from "@/lib/api/types";
import { toast } from "sonner";

interface Genre {
  id: string;
  name: string;
  slug: string;
}

export class GenreService {
  static async getList(): Promise<Genre[]> {
    try {
      const response = await api.get<StandardResponse<Genre[]>>("/genres", {
        revalidate: 60, // Cache for 60 seconds
        tags: ["genres"] // For on-demand revalidation
      });

      if (!response.success) {
        throw new ApiError(response.message || "Failed to fetch genres");
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
        throw error;
      }
      throw new ApiError("Lỗi khi tải danh sách thể loại");
    }
  }

  static async create(data: { name: string }): Promise<Genre> {
    try {
      const response = await api.post<StandardResponse<Genre>>("/genres", data, {
        // Invalidate cache after creating
        tags: ["genres"]
      });

      if (!response.success) {
        throw new ApiError(response.message || "Failed to create genre");
      }

      toast.success("Đã tạo thể loại thành công");
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
        throw error;
      }
      throw new ApiError("Lỗi khi tạo thể loại");
    }
  }
}
```

## Environment Variables

Cấu hình base URL trong `.env`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Hoặc override khi gọi:

```typescript
await api.get("/users", {
  baseURL: "https://api.example.com"
});
```

## Best Practices

### ✅ DO

```typescript
// Use convenience methods
await api.get("/genres");
await api.post("/genres", data);

// Type your responses
await api.get<Genre>("/genres/123");

// Handle errors properly
try {
  await api.get("/genres");
} catch (error) {
  if (error instanceof ApiError) {
    toast.error(error.message);
  }
}

// Use Next.js cache features
await api.get("/genres", { revalidate: 60 });
```

### ❌ DON'T

```typescript
// Don't use fetch directly (loses all features)
await fetch("/api/v1/genres"); // ❌

// Don't stringify body manually
await api.post("/genres", JSON.stringify(data)); // ❌
// Just pass the object:
await api.post("/genres", data); // ✅

// Don't set Content-Type for JSON
await api.post("/genres", data, {
  headers: { "Content-Type": "application/json" } // ❌ Redundant
});

// Don't ignore error types
try {
  await api.get("/genres");
} catch (error) {
  toast.error("Error occurred"); // ❌ Generic message
}
```

## Migration Guide

### From old `fetchWithErrorHandling`:

```typescript
// Old
import { fetchWithErrorHandling } from "@/lib/api/utils/error-handler";

const res = await fetchWithErrorHandling(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
});
const json = await res.json();

// New
import { api } from "@/lib/api/utils/fetch";

const json = await api.post(url, data);
```

### From native fetch:

```typescript
// Old
const res = await fetch(`${API_URL}/genres`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
});

if (!res.ok) {
  throw new Error(`HTTP ${res.status}`);
}

const data = await res.json();

// New
const data = await api.get("/genres");
```

## Troubleshooting

### API calls not logging

Đảm bảo bạn đang ở development mode:

```bash
NODE_ENV=development npm run dev
```

### 401 not redirecting

Kiểm tra xem code có chạy ở client side không (401 handling chỉ hoạt động ở client):

```typescript
"use client"; // Thêm directive này

export function MyComponent() {
  // ...
}
```

### Timeout not working

Đảm bảo timeout value hợp lý (milliseconds):

```typescript
await api.get("/slow-endpoint", {
  timeout: 5000 // 5 seconds (not 5)
});
```

### Base URL không đúng

Kiểm tra environment variable:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Hoặc pass trực tiếp:

```typescript
await api.get("/genres", {
  baseURL: "http://localhost:8080/api/v1"
});
```
