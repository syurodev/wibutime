# API Layer Migration Guide

Sau khi refactor, API layer đã được cải thiện với:
- ✅ Unified authentication utilities
- ✅ Environment-based mock toggle
- ✅ Standardized Zod schema approach
- ✅ **Consolidated fetch utilities (client.ts removed)**
- ✅ Better TypeScript types

## Breaking Changes

### 1. `client.ts` has been REMOVED

**client.ts has been completely removed** và được thay thế bằng `utils/fetch.ts` với nhiều features hơn.

**Before:**
```typescript
import { apiClient } from "@/lib/api/client";
const response = await apiClient.get("/users");
```

**After - Client-side (Browser/Client Components):**
```typescript
import { api } from "@/lib/api/utils/fetch";
const response = await api.get("/users");
```

**After - Server-side (Server Components/Actions):**
```typescript
import { serverApi } from "@/lib/api/server";
const response = await serverApi.get("/users");
```

**After - Authenticated (with explicit token):**
```typescript
import { createAuthenticatedClient } from "@/lib/api/client-auth";
const client = createAuthenticatedClient(); // Auto-detect from localStorage
// Or with explicit token
const client = createAuthenticatedClient(token);
const response = await client.get("/users");
```

### 2. Mock API Toggle

**Before:**
```typescript
// Hardcoded in service file
const USE_MOCK = true;
```

**After:**
```env
# .env.local
NEXT_PUBLIC_USE_MOCK_API=true
```

```typescript
// Use in service
import { API_CONFIG } from "@/lib/api/config";

if (API_CONFIG.useMock) {
  // Mock logic
}
```

### 3. Model Approach

**Before (BaseModel class):**
```typescript
export class User extends BaseModel<UserRaw> {
  constructor(raw: UserRaw) {
    super(raw);
    this.firstName = raw.first_name;
  }
}

const user = User.fromApi(response.data);
```

**After (Zod schema):**
```typescript
export const UserSchema = z.object({
  id: z.string(),
  first_name: z.string(),
});

export type User = z.infer<typeof UserSchema>;

// Use ApiParser
const user = ApiParser.parse(UserSchema, response);
```

### 4. Service Implementation

**Before:**
```typescript
const response = await apiClient.get<UserRaw[]>("/users");
const users = User.fromApiArray(response.data);
```

**After:**
```typescript
const response = await apiClient.get<User[]>("/users");
const users = ApiParser.parseResponseArray(UserSchema, response);
```

## New Features

### 1. Environment Variables

Add to your `.env.local`:

```env
# API Base URL
NEXT_PUBLIC_API_URL=https://api.example.com/v1

# Use mock API (development)
NEXT_PUBLIC_USE_MOCK_API=true

# Enable API debug logging
NEXT_PUBLIC_API_DEBUG=true
```

### 2. Unified Auth Utilities

```typescript
// Client-side
import { getClientAuthToken, setAuthToken, clearAuthToken } from "@/lib/api/auth";

// Set token after login
setAuthToken(token, true); // persistent = true for localStorage

// Get token
const token = getClientAuthToken();

// Clear token on logout
clearAuthToken();

// Server-side
import { getServerAuthToken } from "@/lib/api/auth";
const token = await getServerAuthToken();
```

### 3. Centralized Fetch Utility

```typescript
import { api } from "@/lib/api/utils/fetch";

// Simple API calls with auto auth
const data = await api.get("/users");
const created = await api.post("/users", { name: "John" });
```

### 4. ApiParser for Validation

```typescript
import { ApiParser } from "@/lib/api/utils/parsers";

// Parse single item
const user = ApiParser.parse(UserSchema, response);

// Parse array (skips invalid items)
const users = ApiParser.parseArray(UserSchema, response);

// Safe parse (returns null on error)
const user = ApiParser.safeParse(UserSchema, response);

// Parse with fallback
const user = ApiParser.parseWithFallback(UserSchema, response, defaultUser);
```

## Migration Checklist

- [ ] Update `.env.local` with new environment variables
- [ ] Replace hardcoded `USE_MOCK` with `API_CONFIG.useMock`
- [ ] Update models from BaseModel classes to Zod schemas
- [ ] Update services to use `ApiParser` instead of `Model.fromApi()`
- [ ] Use `createAuthenticatedClient()` in Client Components
- [ ] Use `serverApi` in Server Components
- [ ] Update imports to use new utilities from `@/lib/api`

## Example Migration

**Before:**
```typescript
// lib/api/services/users.ts
import { apiClient } from "../client";
import { User } from "../models/user";

const USE_MOCK = true;

export class UsersService {
  static async getById(id: string) {
    if (USE_MOCK) {
      // mock logic
    }

    const response = await apiClient.get(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return User.fromApi(response.data);
  }
}
```

**After:**
```typescript
// lib/api/services/users.ts
import { API_CONFIG } from "../config";
import { apiClient } from "../client";
import { UserSchema } from "../models/user";
import { ApiParser } from "../utils/parsers";
import { getServerAuthHeaders } from "../auth";

export class UsersService {
  static async getById(id: string) {
    if (API_CONFIG.useMock) {
      // mock logic
    }

    const authHeaders = await getServerAuthHeaders();
    const response = await apiClient.get(`/users/${id}`, {
      headers: authHeaders,
    });

    return ApiParser.parse(UserSchema, response);
  }
}
```

Or even simpler with `serverApi`:

```typescript
import { API_CONFIG } from "../config";
import { serverApi } from "../server";
import { UserSchema } from "../models/user";
import { ApiParser } from "../utils/parsers";

export class UsersService {
  static async getById(id: string) {
    if (API_CONFIG.useMock) {
      // mock logic
    }

    // Auto-handles auth
    const response = await serverApi.get(`/users/${id}`);
    return ApiParser.parse(UserSchema, response);
  }
}
```

## Questions?

Check the updated [README.md](./README.md) for detailed documentation and examples.
