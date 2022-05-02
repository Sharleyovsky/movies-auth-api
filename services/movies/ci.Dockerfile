FROM node:18.0.0-alpine as build-server

WORKDIR /app

COPY .. /app

RUN npm i --silent
RUN npm run build

CMD ["npm", "run", "test"]
CMD ["npm", "run", "start:prod"]