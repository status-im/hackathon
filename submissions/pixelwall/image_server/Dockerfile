FROM node:8-alpine

RUN apk add --no-cache git && rm -rf /var/cache/apk/*

RUN mkdir /app
WORKDIR /app

VOLUME /data/images

COPY package* /app/

RUN npm install

COPY * /app/

CMD node image.js
