# API Client Guide - Genre, Author & Artist

## Tổng quan

Tài liệu này hướng dẫn cách sử dụng các API cho 3 domain chính: **Genre** (Thể loại), **Author** (Tác giả), và **Artist** (Hoạ sĩ).

**Base URL**: `http://localhost:8080/api/v1`

**Response Format**: Tất cả các API đều trả về chuẩn `StandardResponse`:

```json
{
  "success": true,
  "message": "operation.success",
  "data": { ... },
  "meta": { ... }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "error.message",
    "details": "Chi tiết lỗi (nếu có)"
  }
}
```

---

## 1. Genre API (Thể loại)

### 1.1. Lấy danh sách Genres

**Endpoint**: `GET /api/v1/genres`

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | int | No | 1 | Số trang |
| limit | int | No | 20 | Số items mỗi trang (max: 100) |
| search | string | No | - | Tìm kiếm theo tên |
| sort_by | string | No | - | Sắp xếp theo: `name`, `views`, `series`, `created`, `updated` |
| sort_order | string | No | desc | Thứ tự: `asc`, `desc` |
| active_only | bool | No | false | Chỉ lấy genres đang active |

**Response**:
```json
{
  "success": true,
  "message": "genre.list_success",
  "data": [
    {
      "id": "uuid-string",
      "name": "Fantasy",
      "series_count": 150,
      "active_readers": 5000,
      "total_views": 1000000,
      "trend": "rising",
      "description": "Mô tả thể loại Fantasy",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-02T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total_items": 100,
    "total_pages": 5
  }
}
```

**Curl Example**:
```bash
# Lấy danh sách genres với pagination
curl -X GET "http://localhost:8080/api/v1/genres?page=1&limit=20"

# Tìm kiếm genres có tên chứa "fantasy"
curl -X GET "http://localhost:8080/api/v1/genres?search=fantasy"

# Sắp xếp theo số lượt xem giảm dần
curl -X GET "http://localhost:8080/api/v1/genres?sort_by=views&sort_order=desc"

# Chỉ lấy genres đang active
curl -X GET "http://localhost:8080/api/v1/genres?active_only=true"
```

---

### 1.2. Lấy chi tiết Genre

**Endpoint**: `GET /api/v1/genres/:id`

**Path Parameters**:
- `id` (string, required): UUID của genre

**Response**:
```json
{
  "success": true,
  "message": "genre.get_success",
  "data": {
    "id": "uuid-string",
    "name": "Fantasy",
    "slug": "fantasy",
    "description": "Mô tả chi tiết về Fantasy",
    "parent_id": "parent-uuid-string",
    "display_order": 1,
    "is_active": true,
    "series_count": 150,
    "active_readers": 5000,
    "total_views": 1000000,
    "trend": "rising",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

**Curl Example**:
```bash
curl -X GET "http://localhost:8080/api/v1/genres/550e8400-e29b-41d4-a716-446655440000"
```

---

### 1.3. Tạo Genre mới

**Endpoint**: `POST /api/v1/genres`

**Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (nếu có)

**Request Body**:
```json
{
  "name": "Xuanhuan",
  "description": "Thể loại tiên hiệp phương Đông",
  "parent_id": "parent-uuid-string"
}
```

**Validation**:
- `name`: bắt buộc, độ dài 1-100 ký tự
- `description`: tùy chọn, max 1000 ký tự
- `parent_id`: tùy chọn, UUID string

**Response**:
```json
{
  "success": true,
  "message": "genre.created_success",
  "data": {
    "id": "new-uuid",
    "name": "Xuanhuan",
    "slug": "xuanhuan",
    "description": "Thể loại tiên hiệp phương Đông",
    "parent_id": "parent-uuid-string",
    "display_order": 0,
    "is_active": false,
    "series_count": 0,
    "active_readers": 0,
    "total_views": 0,
    "trend": "stable",
    "created_at": "2024-01-03T00:00:00Z",
    "updated_at": "2024-01-03T00:00:00Z"
  }
}
```

**Curl Example**:
```bash
curl -X POST "http://localhost:8080/api/v1/genres" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Xuanhuan",
    "description": "Thể loại tiên hiệp phương Đông"
  }'
```

**Error Responses**:
- `400 INVALID_INPUT`: Dữ liệu đầu vào không hợp lệ
- `409 SLUG_EXISTS`: Slug đã tồn tại
- `400 PARENT_NOT_FOUND`: Parent genre không tồn tại
- `401 UNAUTHORIZED`: Chưa đăng nhập

---

### 1.4. Cập nhật Genre

**Endpoint**: `PUT /api/v1/genres/:id`

**Request Body**:
```json
{
  "name": "Xuanhuan Updated",
  "description": "Mô tả mới",
  "parent_id": "new-parent-uuid",
  "display_order": 5,
  "is_active": true
}
```

**Response**: Giống như response của GET genre detail

**Curl Example**:
```bash
curl -X PUT "http://localhost:8080/api/v1/genres/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Xuanhuan Updated",
    "description": "Mô tả mới",
    "display_order": 5,
    "is_active": true
  }'
```

**Error Responses**:
- `404 GENRE_NOT_FOUND`: Genre không tồn tại
- `409 SLUG_EXISTS`: Slug mới đã tồn tại
- `400 CIRCULAR_REFERENCE`: Tham chiếu vòng (parent reference)

---

### 1.5. Xóa Genre

**Endpoint**: `DELETE /api/v1/genres/:id`

**Response**:
```json
{
  "success": true,
  "message": "genre.deleted_success"
}
```

**Curl Example**:
```bash
curl -X DELETE "http://localhost:8080/api/v1/genres/550e8400-e29b-41d4-a716-446655440000"
```

**Error Responses**:
- `404 GENRE_NOT_FOUND`: Genre không tồn tại
- `409 GENRE_IN_USE`: Genre đang được sử dụng bởi novels
- `409 GENRE_HAS_CHILDREN`: Genre có các genre con

---

## 2. Author API (Tác giả)

### 2.1. Lấy danh sách Authors

**Endpoint**: `GET /api/v1/authors`

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | int | No | 1 | Số trang |
| limit | int | No | 20 | Số items mỗi trang (max: 100) |
| search | string | No | - | Tìm kiếm theo tên |
| sort_by | string | No | - | Sắp xếp theo: `name`, `views`, `novels`, `created` |
| sort_order | string | No | desc | Thứ tự: `asc`, `desc` |
| is_verified | bool | No | - | Lọc theo trạng thái verified |

**Response**:
```json
{
  "success": true,
  "message": "author.list_success",
  "data": [
    {
      "id": "uuid-string",
      "name": "Nhĩ Căn",
      "description": "Tiểu sử tác giả",
      "novel_count": 25,
      "total_views": 5000000,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total_items": 50,
    "total_pages": 3
  }
}
```

**Curl Example**:
```bash
# Lấy danh sách authors
curl -X GET "http://localhost:8080/api/v1/authors?page=1&limit=20"

# Tìm kiếm author theo tên
curl -X GET "http://localhost:8080/api/v1/authors?search=nhĩ+căn"

# Sắp xếp theo số lượng novel giảm dần
curl -X GET "http://localhost:8080/api/v1/authors?sort_by=novels&sort_order=desc"

# Chỉ lấy authors đã verified
curl -X GET "http://localhost:8080/api/v1/authors?is_verified=true"
```

---

### 2.2. Lấy chi tiết Author

**Endpoint**: `GET /api/v1/authors/:id`

**Response**:
```json
{
  "success": true,
  "message": "author.get_success",
  "data": {
    "id": "uuid-string",
    "name": "Nhĩ Căn",
    "slug": "nhi-can",
    "description": "Tiểu sử chi tiết của tác giả",
    "avatar_url": "https://example.com/avatar.jpg",
    "social_links": "{\"facebook\": \"fb.com/author\", \"twitter\": \"@author\"}",
    "novel_count": 25,
    "total_chapters": 5000,
    "total_views": 5000000,
    "follower_count": 10000,
    "is_verified": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

**Curl Example**:
```bash
curl -X GET "http://localhost:8080/api/v1/authors/550e8400-e29b-41d4-a716-446655440000"
```

---

### 2.3. Tạo Author mới

**Endpoint**: `POST /api/v1/authors`

**Request Body**:
```json
{
  "name": "Tân Tác Giả",
  "biography": "Tiểu sử tác giả mới",
  "avatar_url": "https://example.com/avatar.jpg",
  "social_links": "{\"facebook\": \"fb.com/newauthor\"}"
}
```

**Validation**:
- `name`: bắt buộc, độ dài 1-200 ký tự
- `biography`: tùy chọn, max 5000 ký tự
- `avatar_url`: tùy chọn, phải là URL hợp lệ
- `social_links`: tùy chọn, phải là JSON string hợp lệ

**Response**:
```json
{
  "success": true,
  "message": "author.created_success",
  "data": {
    "id": "new-uuid",
    "name": "Tân Tác Giả",
    "slug": "tan-tac-gia",
    "description": "Tiểu sử tác giả mới",
    "avatar_url": "https://example.com/avatar.jpg",
    "social_links": "{\"facebook\": \"fb.com/newauthor\"}",
    "novel_count": 0,
    "total_chapters": 0,
    "total_views": 0,
    "follower_count": 0,
    "is_verified": false,
    "created_at": "2024-01-03T00:00:00Z",
    "updated_at": "2024-01-03T00:00:00Z"
  }
}
```

**Curl Example**:
```bash
curl -X POST "http://localhost:8080/api/v1/authors" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tân Tác Giả",
    "biography": "Tiểu sử tác giả mới",
    "avatar_url": "https://example.com/avatar.jpg"
  }'
```

---

### 2.4. Cập nhật Author

**Endpoint**: `PUT /api/v1/authors/:id`

**Request Body**:
```json
{
  "name": "Tên Mới",
  "biography": "Tiểu sử cập nhật",
  "avatar_url": "https://example.com/new-avatar.jpg",
  "social_links": "{\"facebook\": \"fb.com/updated\"}"
}
```

**Curl Example**:
```bash
curl -X PUT "http://localhost:8080/api/v1/authors/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tên Mới",
    "biography": "Tiểu sử cập nhật"
  }'
```

---

### 2.5. Xóa Author

**Endpoint**: `DELETE /api/v1/authors/:id`

**Response**:
```json
{
  "success": true,
  "message": "author.deleted_success"
}
```

**Curl Example**:
```bash
curl -X DELETE "http://localhost:8080/api/v1/authors/550e8400-e29b-41d4-a716-446655440000"
```

**Error Responses**:
- `404 AUTHOR_NOT_FOUND`: Author không tồn tại
- `409 AUTHOR_IN_USE`: Author đang được sử dụng bởi novels

---

## 3. Artist API (Hoạ sĩ)

### 3.1. Lấy danh sách Artists

**Endpoint**: `GET /api/v1/artists`

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | int | No | 1 | Số trang |
| limit | int | No | 20 | Số items mỗi trang (max: 100) |
| search | string | No | - | Tìm kiếm theo tên |
| sort_by | string | No | - | Sắp xếp theo: `name`, `novels`, `created` |
| sort_order | string | No | desc | Thứ tự: `asc`, `desc` |
| specialization | string | No | - | Lọc theo chuyên môn |
| is_verified | bool | No | - | Lọc theo trạng thái verified |

**Response**:
```json
{
  "success": true,
  "message": "artist.list_success",
  "data": [
    {
      "id": "uuid-string",
      "name": "Hoạ Sĩ ABC",
      "description": "Tiểu sử hoạ sĩ",
      "novel_count": 15,
      "specialization": "cover_artist",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total_items": 30,
    "total_pages": 2
  }
}
```

**Specialization Values**:
- `cover_artist`: Hoạ sĩ vẽ bìa
- `illustrator`: Hoạ sĩ minh họa
- `character_designer`: Nhà thiết kế nhân vật
- `manga_artist`: Hoạ sĩ manga

**Curl Example**:
```bash
# Lấy danh sách artists
curl -X GET "http://localhost:8080/api/v1/artists?page=1&limit=20"

# Tìm kiếm artist theo tên
curl -X GET "http://localhost:8080/api/v1/artists?search=hoạ+sĩ"

# Lọc theo chuyên môn cover_artist
curl -X GET "http://localhost:8080/api/v1/artists?specialization=cover_artist"

# Sắp xếp theo số lượng novel
curl -X GET "http://localhost:8080/api/v1/artists?sort_by=novels&sort_order=desc"
```

---

### 3.2. Lấy chi tiết Artist

**Endpoint**: `GET /api/v1/artists/:id`

**Response**:
```json
{
  "success": true,
  "message": "artist.get_success",
  "data": {
    "id": "uuid-string",
    "name": "Hoạ Sĩ ABC",
    "slug": "hoa-si-abc",
    "description": "Tiểu sử chi tiết của hoạ sĩ",
    "avatar_url": "https://example.com/avatar.jpg",
    "social_links": "{\"instagram\": \"@artist\"}",
    "specialization": "cover_artist",
    "novel_count": 15,
    "artwork_count": 200,
    "follower_count": 5000,
    "is_verified": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

**Curl Example**:
```bash
curl -X GET "http://localhost:8080/api/v1/artists/550e8400-e29b-41d4-a716-446655440000"
```

---

### 3.3. Tạo Artist mới

**Endpoint**: `POST /api/v1/artists`

**Request Body**:
```json
{
  "name": "Hoạ Sĩ Mới",
  "biography": "Tiểu sử hoạ sĩ",
  "avatar_url": "https://example.com/avatar.jpg",
  "social_links": "{\"instagram\": \"@newartist\"}",
  "specialization": "illustrator"
}
```

**Validation**:
- `name`: bắt buộc, độ dài 1-200 ký tự
- `biography`: tùy chọn, max 5000 ký tự
- `avatar_url`: tùy chọn, phải là URL hợp lệ
- `social_links`: tùy chọn, phải là JSON string hợp lệ
- `specialization`: tùy chọn, max 100 ký tự

**Response**:
```json
{
  "success": true,
  "message": "artist.created_success",
  "data": {
    "id": "new-uuid",
    "name": "Hoạ Sĩ Mới",
    "slug": "hoa-si-moi",
    "description": "Tiểu sử hoạ sĩ",
    "avatar_url": "https://example.com/avatar.jpg",
    "social_links": "{\"instagram\": \"@newartist\"}",
    "specialization": "illustrator",
    "novel_count": 0,
    "artwork_count": 0,
    "follower_count": 0,
    "is_verified": false,
    "created_at": "2024-01-03T00:00:00Z",
    "updated_at": "2024-01-03T00:00:00Z"
  }
}
```

**Curl Example**:
```bash
curl -X POST "http://localhost:8080/api/v1/artists" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hoạ Sĩ Mới",
    "biography": "Tiểu sử hoạ sĩ",
    "specialization": "illustrator"
  }'
```

---

### 3.4. Cập nhật Artist

**Endpoint**: `PUT /api/v1/artists/:id`

**Request Body**:
```json
{
  "name": "Tên Mới",
  "biography": "Tiểu sử cập nhật",
  "avatar_url": "https://example.com/new-avatar.jpg",
  "social_links": "{\"instagram\": \"@updated\"}",
  "specialization": "character_designer"
}
```

**Curl Example**:
```bash
curl -X PUT "http://localhost:8080/api/v1/artists/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tên Mới",
    "biography": "Tiểu sử cập nhật",
    "specialization": "character_designer"
  }'
```

---

### 3.5. Xóa Artist

**Endpoint**: `DELETE /api/v1/artists/:id`

**Response**:
```json
{
  "success": true,
  "message": "artist.deleted_success"
}
```

**Curl Example**:
```bash
curl -X DELETE "http://localhost:8080/api/v1/artists/550e8400-e29b-41d4-a716-446655440000"
```

**Error Responses**:
- `404 ARTIST_NOT_FOUND`: Artist không tồn tại
- `409 ARTIST_IN_USE`: Artist đang được sử dụng bởi novels

---

## 4. Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_FAILED | 400 | Dữ liệu đầu vào không hợp lệ |
| INVALID_INPUT | 400 | Input không đúng format |
| INVALID_ID | 400 | UUID không hợp lệ |
| UNAUTHORIZED | 401 | Chưa đăng nhập |
| NOT_FOUND | 404 | Resource không tồn tại |
| SLUG_EXISTS | 409 | Slug đã tồn tại |
| IN_USE | 409 | Resource đang được sử dụng |
| CIRCULAR_REFERENCE | 400 | Tham chiếu vòng (chỉ Genre) |
| HAS_CHILDREN | 409 | Genre có các genre con (chỉ Genre) |
| PARENT_NOT_FOUND | 400 | Parent genre không tồn tại (chỉ Genre) |

---

## 5. Pagination và Sorting

### Pagination

Tất cả các list endpoint đều hỗ trợ pagination:

```bash
# Lấy trang 2, mỗi trang 50 items
curl -X GET "http://localhost:8080/api/v1/genres?page=2&limit=50"
```

Response sẽ chứa `meta` object:
```json
{
  "meta": {
    "page": 2,
    "limit": 50,
    "total_items": 150,
    "total_pages": 3
  }
}
```

### Sorting

Sử dụng `sort_by` và `sort_order`:

```bash
# Sắp xếp genres theo tên tăng dần
curl -X GET "http://localhost:8080/api/v1/genres?sort_by=name&sort_order=asc"

# Sắp xếp authors theo số lượng novel giảm dần
curl -X GET "http://localhost:8080/api/v1/authors?sort_by=novels&sort_order=desc"
```

### Search

Tìm kiếm theo tên (case-insensitive):

```bash
# Tìm genres có tên chứa "fantasy"
curl -X GET "http://localhost:8080/api/v1/genres?search=fantasy"

# Tìm authors có tên chứa "nhĩ căn"
curl -X GET "http://localhost:8080/api/v1/authors?search=nhĩ+căn"
```

---

## 6. Filter Options

### Genre Filters
- `active_only`: Chỉ lấy genres đang active

### Author Filters
- `is_verified`: Lọc theo trạng thái verified

### Artist Filters
- `specialization`: Lọc theo chuyên môn (cover_artist, illustrator, etc.)
- `is_verified`: Lọc theo trạng thái verified

**Example**:
```bash
# Lấy artists là cover_artist và đã verified
curl -X GET "http://localhost:8080/api/v1/artists?specialization=cover_artist&is_verified=true"
```

---

## 7. Best Practices

### 7.1. Error Handling

Luôn kiểm tra `success` field trong response:

```javascript
const response = await fetch('http://localhost:8080/api/v1/genres');
const data = await response.json();

if (!data.success) {
  console.error('Error:', data.error.code, data.error.message);
  // Handle error
} else {
  console.log('Data:', data.data);
}
```

### 7.2. Pagination

Sử dụng `meta` để implement pagination UI:

```javascript
const { page, limit, total_items, total_pages } = data.meta;

// Hiển thị: "Showing 21-40 of 100 items"
const start = (page - 1) * limit + 1;
const end = Math.min(page * limit, total_items);
console.log(`Showing ${start}-${end} of ${total_items} items`);
```

### 7.3. Search với debounce

Implement debounce khi search để tránh gọi API quá nhiều:

```javascript
let debounceTimer;
function searchGenres(query) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetch(`http://localhost:8080/api/v1/genres?search=${query}`)
      .then(res => res.json())
      .then(data => {
        // Update UI
      });
  }, 300);
}
```

### 7.4. Combine Filters

Kết hợp nhiều filters để lọc chính xác:

```bash
# Tìm authors verified, sắp xếp theo views, trang 2
curl -X GET "http://localhost:8080/api/v1/authors?is_verified=true&sort_by=views&sort_order=desc&page=2&limit=20"
```

---

## 8. JavaScript/TypeScript Examples

### 8.1. Fetch Genres

```typescript
interface Genre {
  id: string;
  name: string;
  series_count: number;
  active_readers: number;
  total_views: number;
  trend: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

async function fetchGenres(
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<StandardResponse<Genre[]>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append('search', search);
  }

  const response = await fetch(`http://localhost:8080/api/v1/genres?${params}`);
  return response.json();
}

// Usage
const result = await fetchGenres(1, 20, 'fantasy');
if (result.success) {
  console.log('Genres:', result.data);
  console.log('Meta:', result.meta);
}
```

### 8.2. Create Author

```typescript
interface CreateAuthorRequest {
  name: string;
  biography?: string;
  avatar_url?: string;
  social_links?: string;
}

async function createAuthor(data: CreateAuthorRequest): Promise<StandardResponse<Author>> {
  const response = await fetch('http://localhost:8080/api/v1/authors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

// Usage
const newAuthor = await createAuthor({
  name: 'Tân Tác Giả',
  biography: 'Tiểu sử tác giả mới',
});

if (newAuthor.success) {
  console.log('Created author:', newAuthor.data);
}
```

### 8.3. Update Artist

```typescript
interface UpdateArtistRequest {
  name: string;
  biography?: string;
  avatar_url?: string;
  social_links?: string;
  specialization?: string;
}

async function updateArtist(
  id: string,
  data: UpdateArtistRequest
): Promise<StandardResponse<Artist>> {
  const response = await fetch(`http://localhost:8080/api/v1/artists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

// Usage
const updated = await updateArtist('550e8400-e29b-41d4-a716-446655440000', {
  name: 'Tên Mới',
  specialization: 'illustrator',
});
```

---

## 9. Testing với Postman

### Import Collection

1. Tạo một collection mới trong Postman
2. Thêm các requests sau:

**Genre Collection**:
- GET List Genres
- GET Genre Detail
- POST Create Genre
- PUT Update Genre
- DELETE Delete Genre

**Author Collection**:
- GET List Authors
- GET Author Detail
- POST Create Author
- PUT Update Author
- DELETE Delete Author

**Artist Collection**:
- GET List Artists
- GET Artist Detail
- POST Create Artist
- PUT Update Artist
- DELETE Delete Artist

### Environment Variables

Tạo environment với variables:
- `base_url`: `http://localhost:8080/api/v1`
- `genre_id`: UUID của genre test
- `author_id`: UUID của author test
- `artist_id`: UUID của artist test

---

## 10. Rate Limiting & Performance

### Recommendations

1. **Pagination**: Không request quá 100 items một lúc
2. **Search**: Sử dụng debounce 300ms khi implement search
3. **Caching**: Cache responses ở client side khi có thể
4. **Batch requests**: Gom nhiều requests lại nếu có thể

---

## 11. Support & Contact

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra error response để biết chi tiết lỗi
2. Xem lại validation requirements
3. Contact support team với error code và request details
