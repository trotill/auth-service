FROM node:18.13

WORKDIR /app

RUN apt update && apt install sqlite3
ADD . /app
RUN rm -rf /app/node_modules /app/dist /app/yarn.lock /app/.env /app/store/*
RUN yarn install
CMD /bin/sh -c "yarn && yarn migrate && yarn seed && yarn start"
