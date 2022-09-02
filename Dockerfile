FROM node:16-alpine AS base
WORKDIR /opt/app
RUN apk update
RUN apk --no-cache add git python3 make g++ pkgconfig \
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


COPY package.json package-lock.json ./
RUN npm ci
COPY . .

RUN npm run build

CMD ["npm", "run", "serve"]
