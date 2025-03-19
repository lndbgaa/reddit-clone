FROM node:23-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

FROM base AS dev

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM base AS prod

ENV NODE_ENV=production

RUN npm install --only=production

COPY . .

# to complete..