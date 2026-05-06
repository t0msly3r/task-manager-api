# Dependencies
FROM node:20 as dependencies
WORKDIR /app

COPY package*.json ./
RUN npm install

# Build
FROM node:20 as build
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production
FROM node:20 AS production
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/build ./build
COPY --from=build /app/prisma ./prisma

RUN npx prisma generate

EXPOSE 3000

CMD npx prisma migrate deploy && node build/server.js