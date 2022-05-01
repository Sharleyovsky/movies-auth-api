FROM node:18.0.0-alpine as build-server

WORKDIR /auth

COPY . /auth

RUN npm i --silent

CMD ["npm", "start"]