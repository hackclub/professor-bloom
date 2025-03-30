FROM node:20

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 3000

RUN pnpm prisma db push
RUN pnpm run build

CMD ["pnpm", "run", "start"]