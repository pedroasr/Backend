FROM node:16

ENV PORT 3099

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci && npm run build

COPY ./dist ./

COPY ./src/database/fillDatabase.txt ./database

EXPOSE 3099

CMD ["npm", "start"]
