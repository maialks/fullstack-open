# syntax=docker/dockerfile:1
FROM node:20
WORKDIR /usr/src/todo-app/backend

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npx", "nodemon", "./bin/www"]