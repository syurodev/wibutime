# Stage 1: Giai đoạn build
FROM oven/bun:alpine AS builder

# Ghi version vào label
ARG APP_VERSION=latest
LABEL version=$APP_VERSION

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Sao chép file package.json và bun.lockb
COPY package.json bun.lockb tsconfig.json .env ./

# Cài đặt tất cả dependencies (bao gồm cả devDependencies)
RUN bun install

# Sao chép mã nguồn vào container
COPY . .

# Build mã nguồn
RUN bun run build

# Dọn dẹp node_modules để giảm kích thước
RUN find ./node_modules -type f -name "*.md" -delete \
  && find ./node_modules -type f -name "*.ts" -delete \
  && find ./node_modules -type f -name "*.map" -delete
RUN find . -type f -name ".DS_Store" -delete

# Stage 2: Giai đoạn production
FROM oven/bun:alpine

# Thêm các biến môi trường như trong ví dụ của bạn
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Cấu hình MinIO từ môi trường
ARG SERVICE_PORT

ENV SERVICE_PORT=$SERVICE_PORT

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Sao chép các file cần thiết từ giai đoạn build
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/tsconfig.json ./tsconfig.json
COPY --from=builder /usr/src/app/.env ./.env

# Expose port 3999
EXPOSE 3000

# Chạy ứng dụng
CMD ["bun", "start"]
