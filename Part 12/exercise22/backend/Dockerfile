# syntax=docker/dockerfile:1.4
# deps
FROM node:20 AS deps
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm ci --omit=dev

# minimal testing
FROM deps AS test
WORKDIR /usr/src/app
COPY . .
RUN chown -R node:node /usr/src/app
USER node
RUN npm run test

# start (dev mode + dumb init, recieved SIGINT error when testing)
FROM test AS runtime-dev
USER root
RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
USER node
COPY . .
ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "index.js"]