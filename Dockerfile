# --------------> The build image__
FROM node:16.20.1 AS development
RUN apt-get update && apt-get install -y --no-install-recommends

WORKDIR /usr/src/app

COPY package*.json ./
COPY ./prisma prisma
COPY yarn.lock ./
RUN yarn install
COPY . .

# Build the project
CMD ["yarn", "run", "build"]

# --------------> The production image__
FROM node:16.20.1-bullseye-slim as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
# COPY . .
COPY --from=development /usr/src/app/dist ./dist
COPY --chown=node:node --from=development /usr/src/app/prisma ./prisma
# COPY --from=development /usr/src/app/client ./dist/client
RUN yarn generate
EXPOSE 3003
USER node

CMD ["node", "dist/main"]
# CMD ["npm", "run", "start:prod"]
