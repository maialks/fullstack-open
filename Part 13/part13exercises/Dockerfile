# sintax=docker/dockerfile:1
# frontend
FROM node:20 AS frontend-deps
WORKDIR /usr/src/app/frontend
COPY ./frontend/package*.json ./
RUN npm ci

FROM frontend-deps AS frontend-build
WORKDIR /usr/src/app/frontend
COPY ./frontend .
RUN chown -R node:node /usr/src/app/frontend
USER node
ENV VITE_BACKEND_URL=/api
ENV NODE_ENV=production
RUN npm run build

# backend
FROM node:20 AS backend-deps
WORKDIR /usr/src/app/backend
COPY ./backend/package*.json ./
RUN npm ci --only=dev

FROM backend-deps AS backend-build
WORKDIR /usr/src/app/backend
COPY ./backend/package*.json ./
COPY ./backend/tsconfig.json ./
RUN npm ci --only=dev
COPY ./backend ./
RUN npm run build

# fullstack runtime
FROM node:20
RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
COPY --from=frontend-build /usr/src/app/frontend/dist ./public
COPY --from=backend-build /usr/src/app/backend/package*.json .
COPY --from=backend-build /usr/src/app/backend/dist .
COPY --from=backend-build /usr/src/app/backend/migrations ./migrations
ENV NODE_ENV=production
RUN npm ci --only=prod
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "./index.js"]


