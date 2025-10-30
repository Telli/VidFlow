# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/client/package.json ./packages/client/
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build --workspace @vidflow/shared && npm run build --workspace @vidflow/client

# --- Serve stage ---
FROM nginx:1.27-alpine AS serve
COPY --from=build /app/packages/client/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
