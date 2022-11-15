FROM node:18-alpine

WORKDIR /usr/src/app
COPY src/package* /usr/src/app/
RUN npm i
COPY src/ /usr/src/app
CMD npm run start