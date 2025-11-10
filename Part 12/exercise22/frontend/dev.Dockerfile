# syntax=docker/dockerfile:1
FROM node:20 AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

COPY . .
ENV NODE_ENV=dev
CMD ["npm", "run", "dev", "--", "--host"]
EXPOSE 5173