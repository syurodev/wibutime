-- Insert Roles
INSERT INTO roles (name, description, is_system) VALUES
('admin', '{"en":"Full system administrator with complete control","vi":"Quản trị viên hệ thống với quyền kiểm soát hoàn toàn"}', 1),
('moderator', '{"en":"Content moderator with management capabilities","vi":"Người kiểm duyệt nội dung với khả năng quản lý"}', 1),
('content_manager', '{"en":"Manages manga, anime, and light novel content","vi":"Quản lý nội dung manga, anime và light novel"}', 1),
('user', '{"en":"Regular user with basic access privileges","vi":"Người dùng thông thường với các quyền truy cập cơ bản"}', 1);

-- Insert Permissions for User Management
INSERT INTO permissions (name, description, module, action, is_system) VALUES
('user.create', '{"en":"Create new users","vi":"Tạo người dùng mới"}', 'user', 'create', 1),
('user.read', '{"en":"View user information","vi":"Xem thông tin người dùng"}', 'user', 'read', 1),
('user.update', '{"en":"Update user information","vi":"Cập nhật thông tin người dùng"}', 'user', 'update', 1),
('user.delete', '{"en":"Delete user accounts","vi":"Xóa tài khoản người dùng"}', 'user', 'delete', 1),
('user.block', '{"en":"Block/unblock users","vi":"Chặn/bỏ chặn người dùng"}', 'user', 'block', 1),

-- Content Management Permissions
('content.create', '{"en":"Create new manga/anime/light novel entries","vi":"Tạo mục manga/anime/light novel mới"}', 'content', 'create', 1),
('content.read', '{"en":"View content entries","vi":"Xem các mục nội dung"}', 'content', 'read', 1),
('content.update', '{"en":"Update content information","vi":"Cập nhật thông tin nội dung"}', 'content', 'update', 1),
('content.delete', '{"en":"Delete content entries","vi":"Xóa các mục nội dung"}', 'content', 'delete', 1),
('content.publish', '{"en":"Publish or unpublish content","vi":"Xuất bản hoặc hủy xuất bản nội dung"}', 'content', 'publish', 1),

-- Comment Management Permissions
('comment.create', '{"en":"Create comments","vi":"Tạo bình luận"}', 'comment', 'create', 1),
('comment.read', '{"en":"View comments","vi":"Xem bình luận"}', 'comment', 'read', 1),
('comment.update', '{"en":"Update comments","vi":"Cập nhật bình luận"}', 'comment', 'update', 1),
('comment.delete', '{"en":"Delete comments","vi":"Xóa bình luận"}', 'comment', 'delete', 1),
('comment.moderate', '{"en":"Moderate comments","vi":"Kiểm duyệt bình luận"}', 'comment', 'moderate', 1),

-- Report Management Permissions
('report.create', '{"en":"Create reports","vi":"Tạo báo cáo"}', 'report', 'create', 1),
('report.read', '{"en":"View reports","vi":"Xem báo cáo"}', 'report', 'read', 1),
('report.update', '{"en":"Update report status","vi":"Cập nhật trạng thái báo cáo"}', 'report', 'update', 1),
('report.delete', '{"en":"Delete reports","vi":"Xóa báo cáo"}', 'report', 'delete', 1);

-- Assign Permissions to Admin Role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'admin';

-- Assign Permissions to Moderator Role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'moderator'
AND p.name IN (
    'content.read', 'content.update',
    'comment.read', 'comment.update', 'comment.delete', 'comment.moderate',
    'report.read', 'report.update'
);

-- Assign Permissions to Content Manager Role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'content_manager'
AND p.name IN (
    'content.create', 'content.read', 'content.update', 'content.delete', 'content.publish'
);

-- Assign Permissions to Regular User Role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'user'
AND p.name IN (
    'content.read',
    'comment.create', 'comment.read',
    'report.create'
);