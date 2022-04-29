FROM node:16

ENV NODE_ENV production

ENV PORT 3099

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci

COPY ./dist ./

COPY ./src/database/fillDatabase.txt ./database

EXPOSE 3099

CMD ["npm", "start"]