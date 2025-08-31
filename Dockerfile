FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@10
RUN npm install -verbose

COPY . .

CMD [ "node", "dist/index.js" ]
