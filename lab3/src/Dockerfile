FROM node:18-alpine

WORKDIR /usr/src/app
COPY package* /usr/src/app/
RUN npm i
COPY . /usr/src/app
CMD npm run start