# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist/ /usr/share/nginx/html
