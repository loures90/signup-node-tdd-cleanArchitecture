FROM node:17-alpine3.14

WORKDIR /usr/src/clean-node-api

COPY package.json .
RUN npm install --only=prod

# COPY ./dist ./dist
# CMD npm start
