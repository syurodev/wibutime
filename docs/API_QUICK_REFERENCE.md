# API Quick Reference

## Base URL
```
http://localhost:8080/api/v1
```

## Endpoints Summary

### Genre (Thể loại)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/genres` | Lấy danh sách genres |
| GET | `/genres/:id` | Lấy chi tiết genre |
| POST | `/genres` | Tạo genre mới |
| PUT | `/genres/:id` | Cập nhật genre |
| DELETE | `/genres/:id` | Xóa genre |

### Author (Tác giả)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/authors` | Lấy danh sách authors |
| GET | `/authors/:id` | Lấy chi tiết author |
| POST | `/authors` | Tạo author mới |
| PUT | `/authors/:id` | Cập nhật author |
| DELETE | `/authors/:id` | Xóa author |

### Artist (Hoạ sĩ)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/artists` | Lấy danh sách artists |
| GET | `/artists/:id` | Lấy chi tiết artist |
| POST | `/artists` | Tạo artist mới |
| PUT | `/artists/:id` | Cập nhật artist |
| DELETE | `/artists/:id` | Xóa artist |

## Common Query Parameters

### List Endpoints
- `page` (int): Số trang, default = 1
- `limit` (int): Số items/trang, default = 20, max = 100
- `search` (string): Tìm kiếm theo tên
- `sort_by` (string): Trường để sắp xếp
- `sort_order` (string): `asc` hoặc `desc`

### Genre Sort Options
- `name`, `views`, `series`, `created`, `updated`

### Author Sort Options
- `name`, `views`, `novels`, `created`

### Artist Sort Options
- `name`, `novels`, `created`

## Quick Examples

### Lấy danh sách với pagination
```bash
curl -X GET "http://localhost:8080/api/v1/genres?page=1&limit=20"
```

### Tìm kiếm
```bash
curl -X GET "http://localhost:8080/api/v1/authors?search=nhĩ+căn"
```

### Sắp xếp
```bash
curl -X GET "http://localhost:8080/api/v1/genres?sort_by=views&sort_order=desc"
```

### Tạo mới
```bash
curl -X POST "http://localhost:8080/api/v1/genres" \
  -H "Content-Type: application/json" \
  -d '{"name": "Fantasy", "description": "Mô tả"}'
```

### Cập nhật
```bash
curl -X PUT "http://localhost:8080/api/v1/genres/{id}" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Name", "is_active": true}'
```

### Xóa
```bash
curl -X DELETE "http://localhost:8080/api/v1/genres/{id}"
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "operation.success",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total_items": 100,
    "total_pages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "error.message",
    "details": "Chi tiết lỗi"
  }
}
```

## Common Error Codes
- `400 VALIDATION_FAILED`: Dữ liệu không hợp lệ
- `401 UNAUTHORIZED`: Chưa đăng nhập
- `404 NOT_FOUND`: Không tìm thấy
- `409 SLUG_EXISTS`: Slug đã tồn tại
- `409 IN_USE`: Resource đang được sử dụng

---

Xem [API_CLIENT_GUIDE.md](./API_CLIENT_GUIDE.md) để biết chi tiết đầy đủ.
