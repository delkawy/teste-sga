FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn cache clean && yarn install

COPY . .

RUN yarn build && yarn prisma generate

EXPOSE 3000

CMD ["yarn", "start:prod"]