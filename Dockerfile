# ─── Stage 1: Build ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install system build tools needed for native modules (esbuild, @tailwindcss/oxide)
RUN apk add --no-cache python3 make g++

# Copy package files first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install pnpm globally then install deps (allow build scripts for native modules)
RUN npm install -g pnpm && \
    pnpm config set unsafe-perm true && \
    pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the production bundle (Vite)
RUN pnpm build

# ─── Stage 2: Serve ─────────────────────────────────────────────────────────
FROM nginx:alpine AS production

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config for SPA routing (handles React Router paths)
RUN printf 'server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
  location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {\n\
    expires 1y;\n\
    add_header Cache-Control "public, immutable";\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
