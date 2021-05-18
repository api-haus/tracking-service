FROM node:14-alpine

RUN apk add git

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
