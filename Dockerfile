FROM node:20

RUN apt-get update && \
    apt-get install -y git --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm
RUN pnpm install


# Accept Git commit hash as build arguments
ARG GIT_COMMIT_SHA=unknown_full
ARG GIT_COMMIT_SHORT_SHA=unknown_short

# Set them as environment variables
ENV GIT_COMMIT_SHA=${GIT_COMMIT_SHA}
ENV GIT_COMMIT_SHORT_SHA=${GIT_COMMIT_SHORT_SHA}

EXPOSE 3000

RUN pnpm prisma db push
RUN pnpm run build

CMD ["pnpm", "run", "start"]
