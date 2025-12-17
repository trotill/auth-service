FROM node:20.16-alpine

WORKDIR /app

RUN apk update && apk add --no-cache sqlite
COPY src/ /app/src
COPY swagger/ /app/swagger
COPY *.json *.js yarn.lock .sequelizerc /app/

RUN yarn install \
    && yarn build \
    && yarn install --production --ignore-scripts --prefer-offline \
    && yarn cache clean --all \
    && find dist -name '*.map' -delete \
    && find dist -name '*.d.ts' -delete
CMD /bin/sh -c "yarn start:pack"
