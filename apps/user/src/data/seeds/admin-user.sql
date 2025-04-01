-- Thêm user admin - password: admin
INSERT INTO users (username, password, name, email, avatar, bio, is_change_password, is_verify_email, is_block)
VALUES 
('admin', '$2b$10$gsBy/JdXrMqKhnijWPK0u.sry8ninGi3ppS0ZTDopH1fsjW7eADDO', 'Administrator', 'admin@example.com', '', '[]', 0, 1, 0)
RETURNING id;


-- Lấy id của user admin vừa tạo
WITH inserted_user AS (
    SELECT id FROM users WHERE username = 'admin'
)
-- Gán role admin cho user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM inserted_user u
JOIN roles r ON r.name = 'admin';