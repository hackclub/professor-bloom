FROM node:20

RUN apt-get update && \
    apt-get install -y git --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

# Set Git commit hash environment variables
RUN GIT_COMMIT_SHORT_SHA=$(git log --pretty=format:%h -n1 2>/dev/null || echo "unknown_short") && \
    GIT_COMMIT_SHA=$(git log --pretty=format:%H -n1 2>/dev/null || echo "unknown_full") && \
    echo "GIT_COMMIT_SHORT_SHA=$GIT_COMMIT_SHORT_SHA" >> /etc/environment && \
    echo "GIT_COMMIT_SHA=$GIT_COMMIT_SHA" >> /etc/environment

# Load ENV variables into image
ENV GIT_COMMIT_SHORT_SHA=unknown_short
ENV GIT_COMMIT_SHA=unknown_full

EXPOSE 3000

RUN pnpm prisma db push
RUN pnpm run build

CMD ["pnpm", "run", "start"]
