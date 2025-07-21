# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend .
RUN npm run build

# Stage 2: Setup backend and serve frontend
FROM node:20-alpine AS final
WORKDIR /app
# Backend deps
COPY package.json package-lock.json ./
RUN npm ci
COPY backend.js ./
# Copy built frontend
COPY --from=frontend-build /app/frontend/.next ./frontend/.next
COPY --from=frontend-build /app/frontend/public ./frontend/public
COPY --from=frontend-build /app/frontend/package.json ./frontend/package.json
COPY --from=frontend-build /app/frontend/next.config.ts ./frontend/next.config.ts
COPY --from=frontend-build /app/frontend/tailwind.config.ts ./frontend/tailwind.config.ts
COPY --from=frontend-build /app/frontend/postcss.config.mjs ./frontend/postcss.config.mjs
COPY --from=frontend-build /app/frontend/tsconfig.json ./frontend/tsconfig.json
COPY --from=frontend-build /app/frontend/eslint.config.mjs ./frontend/eslint.config.mjs

# Install frontend serve deps
WORKDIR /app/frontend
RUN npm ci --omit=dev
WORKDIR /app

# Install a simple process manager
RUN npm install -g concurrently

# Entrypoint: run both backend and frontend
CMD concurrently "node backend.js" "npm --prefix ./frontend run start"

EXPOSE 3000
EXPOSE 4000 