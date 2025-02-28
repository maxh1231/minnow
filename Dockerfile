FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . /app

CMD node deploy-commands.js && node index.js
