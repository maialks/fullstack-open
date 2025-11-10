# syntax=docker/dockerfile:1
# deps
FROM node:20
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install

# start (dev mode + dumb init, recieved SIGINT error when testing)
RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init && \
    rm -rf /var/lib/apt/lists/* 
COPY . .
ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "run", "dev"]