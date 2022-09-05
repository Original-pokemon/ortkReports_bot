FROM node:lts-alpine

WORKDIR /home/node/

COPY . .

RUN npm install

ENV TZ=Europe/Moscow

CMD ["node", "index.js"]