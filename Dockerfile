FROM node:lts-alpine

WORKDIR /home/node/

COPY . .

RUN npm install

CMD ["node", "index.js"]