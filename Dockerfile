FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@10.4.0
RUN npm install -verbose

COPY . .

CMD [ "node", "dist/index.js" ]
