# syntax=docker/dockerfile:1
# deps
FROM node:20 AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

# build
FROM deps AS build
WORKDIR /usr/src/app
COPY . .
RUN chown -R node:node /usr/src/app
USER node
ENV VITE_BACKEND_URL=/api/
ENV NODE_ENV=production
RUN npm run build

# runtime
FROM nginx:1.29
COPY --from=build /usr/src/app/dist /usr/share/nginx/html