# =======================================================
# GIAI ĐOẠN 1: BUILD - Cài đặt dependencies và Biên dịch code
# =======================================================
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc bên trong container
WORKDIR /usr/src/app

# Copy các file cần thiết cho việc cài đặt dependencies và build
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
# Copy thư mục chứa schema.prisma
COPY prisma ./prisma 
COPY src/ src/

# Cài đặt dependencies
RUN yarn install --frozen-lockfile

# Chạy Prisma Generate để tạo client và các types
RUN npx prisma generate

# BƯỚC KHẮC PHỤC LỖI: Biên dịch trực tiếp bằng TypeScript Compiler (tsc)
# Lệnh này sử dụng tsconfig.build.json để buộc NestJS biên dịch
# và đặt output vào thư mục './dist'.
RUN npx tsc -p tsconfig.build.json

# BƯỚC KIỂM TRA BẮT BUỘC (Chỉ dùng để kiểm tra, nếu thành công thì không báo lỗi)
RUN test -f dist/main.js || (echo "FATAL ERROR: dist/main.js not found after tsc build!" && exit 1)


# =======================================================
# GIAI ĐOẠN 2: PRODUCTION - Chỉ chứa runtime và code đã build
# =======================================================
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Cài đặt dependencies production
COPY package*.json ./
RUN yarn install --production --frozen-lockfile

# Copy thư mục dist đã build và schema
COPY --from=builder /usr/src/app/dist ./dist
# Copy file schema.prisma (cần thiết cho Prisma Client Runtime)
COPY prisma/schema.prisma ./prisma/schema.prisma
# Copy các file client nội bộ của Prisma (rất quan trọng)
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Đặt lệnh khởi động
CMD [ "node", "dist/main.js" ]