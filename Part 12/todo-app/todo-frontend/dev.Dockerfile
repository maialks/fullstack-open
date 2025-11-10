# syntax=docker/dockerfile:1

# deps
FROM node:20 AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# dev
FROM deps AS dev
WORKDIR /usr/src/app
COPY . .
ENV NODE_ENV=dev
CMD ["npm", "run", "dev", "--", "--host"]
EXPOSE 5173
