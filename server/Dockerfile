FROM node:23-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

##################
FROM base AS dev

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]

##################
FROM base AS build

RUN npm install

COPY . .

RUN npm run build

##################
FROM node:23-alpine AS prod

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /usr/src/app/dist /usr/src/app/dist

EXPOSE 8080

CMD ["npm", "start"]