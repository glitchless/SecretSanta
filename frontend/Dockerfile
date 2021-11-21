FROM node:15.0.1-alpine3.10 AS builder

RUN apk add --update --no-cache python2 alpine-sdk

WORKDIR /build-dir/

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.19.3-alpine

RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir -p /static/config/
COPY deploy/nginx.conf /etc/nginx/conf.d/santa.conf
COPY deploy/default.json /static/config/base.json

COPY --from=builder /build-dir/dist/ /usr/share/nginx/html
