FROM node:14-alpine AS builder

WORKDIR /opt/app

# RUN chown node:node /opt/app

RUN apk update
RUN apk --no-cache add git python make g++ pkgconfig \
  build-base \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  musl-dev \
  giflib-dev \
  pixman-dev \
  pangomm-dev \
  libjpeg-turbo-dev \
  freetype-dev

RUN wget -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
  wget -O glibc-2.32-r0.apk https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.32-r0/glibc-2.32-r0.apk && \
  apk add glibc-2.32-r0.apk

# USER node

RUN apk add --no-cache su-exec \
  cairo \
  jpeg \
  pango \
  musl \
  giflib \
  pixman \
  pangomm \
  libjpeg-turbo \
  freetype


COPY package.json package-lock.json ./
RUN npm ci
COPY . .

RUN npm run build

CMD ["npm", "run", "serve"]