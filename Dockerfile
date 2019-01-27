FROM node:11-alpine

# Create app directory
WORKDIR /usr/src/app

RUN apk add yarn

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn

# Bundle app source
COPY . .
RUN yarn start

FROM nginx:stable-alpine

COPY --from=0 /usr/src/app/* /usr/share/nginx/html/