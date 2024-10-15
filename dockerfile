# 使用官方 Node.js 鏡像作為基礎鏡像
FROM node:16-alpine AS build-stage

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 並安裝依賴
COPY package*.json ./
RUN npm install

# 複製專案文件並執行構建
COPY . .
RUN npm run build

# 使用官方 nginx 鏡像作為基礎鏡像
FROM nginx:alpine AS production-stage

# 複製構建的靜態文件到 nginx 默認的靜態文件目錄
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose 80 port
EXPOSE 80

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]
