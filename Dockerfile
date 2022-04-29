FROM node:16-alpine as builder

WORKDIR /usr/app
COPY . .
RUN npm ci
RUN npm run build
COPY ./src/database/fillDatabase.txt ./database

FROM node:16-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci 
COPY --from=builder /usr/app/dist /usr/app/dist
ENV HTTP_PORT 3099
EXPOSE ${HTTP_PORT}
CMD ["npm", "start"]