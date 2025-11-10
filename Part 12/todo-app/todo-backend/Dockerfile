# syntax=docker/dockerfile:1
FROM node:20
WORKDIR /usr/src/app


COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

RUN chown -R node:node /usr/src/app
USER node
ENV NODE_ENV=production
EXPOSE 3000

USER node
CMD ["node", "./bin/www"]
