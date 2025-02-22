FROM node:20.16-alpine

WORKDIR /app

RUN apk update
RUN apk add --no-cache sqlite
ADD . /app
RUN rm -rf /app/node_modules /app/dist /app/.env /app/store/*
RUN yarn install
RUN yarn build
CMD /bin/sh -c "yarn start:pack"
