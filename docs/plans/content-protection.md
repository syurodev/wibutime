# Kế hoạch Triển khai: Bảo vệ Nội dung với Shadow DOM & Font Scrambling

## Tổng quan

Kế hoạch này mô tả phương pháp bảo vệ nội dung truyện (Novel) khỏi các crawler đơn giản và ngăn chặn việc sao chép văn bản bằng cách sử dụng Shadow DOM kết hợp với kỹ thuật Font Scrambling.

## Chiến lược Kỹ thuật

### 1. Shadow DOM (Client-side)

Sử dụng Shadow DOM với chế độ `closed` để gói gọn nội dung hiển thị.

- **Mục đích**:
  - Ngăn chặn các script bên ngoài (quảng cáo, extension rác) can thiệp vào giao diện đọc.
  - Làm khó các crawler "mì ăn liền" (dựa trên `document.querySelector`).
  - Cách ly CSS: Style của trang web không ảnh hưởng đến nội dung truyện và ngược lại.

### 2. Font Scrambling (Server-side & Client-side)

- **Cơ chế**:
  - **Server (Go)**: Tạo ra một map ký tự ngẫu nhiên (ví dụ: `a` -> `\uE001`, `b` -> `\uE002`) và generate file font `.woff2` tương ứng.
  - **Content**: Convert nội dung truyện theo map này trước khi gửi xuống client.
  - **Client**: Nhận nội dung "mã hóa" và file font custom để hiển thị lại thành văn bản đọc được.
- **Mục đích**: Chống copy/paste. Người dùng copy sẽ chỉ nhận được các ký tự rác.

## Các Component Cần Thực Hiện

### `ShadowDOMWrapper`

Component React chịu trách nhiệm tạo Shadow Root và inject styles.

```tsx
// features/editor/components/shadow-dom-wrapper.tsx
// (Pseudo-code)
export const ShadowDOMWrapper = ({ children, fontUrl }) => {
  // 1. Attach Shadow Root (mode: 'closed')
  // 2. Copy global styles (Tailwind) into Shadow Root
  // 3. Inject @font-face CSS
  // 4. Render children via Portal
};
```

### `ProtectedStaticEditorView`

Wrapper bao quanh `StaticEditorView` hiện tại để thêm lớp bảo vệ.

```tsx
// features/editor/components/protected-static-editor-view.tsx
export const ProtectedStaticEditorView = (props) => {
  return (
    <ShadowDOMWrapper fontUrl={props.fontUrl}>
      <StaticEditorView {...props} />
    </ShadowDOMWrapper>
  );
};
```

## Lưu ý Quan trọng

1.  **Accessibility**: Giải pháp này sẽ làm hỏng trải nghiệm của trình đọc màn hình (Screen Readers). Cần cân nhắc kỹ nếu đối tượng người dùng bao gồm người khiếm thị.
2.  **Search**: Chức năng tìm kiếm (Ctrl+F) của trình duyệt sẽ không hoạt động chính xác với nội dung bị scramble.
3.  **Hiệu năng**: Cần cache file font cẩn thận phía server (theo Chapter hoặc Time Window) để tránh tải lại liên tục.
