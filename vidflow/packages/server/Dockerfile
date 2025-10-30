# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Root deps for workspaces
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/server/package.json ./packages/server/
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build --workspace @vidflow/shared && npm run build --workspace @vidflow/server

# --- Runtime stage ---
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/packages/server/package.json ./packages/server/package.json
RUN npm ci --omit=dev --ignore-scripts

COPY --from=build /app/packages/server/dist ./packages/server/dist

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:4000/health || exit 1
CMD ["node", "packages/server/dist/index.js"]
