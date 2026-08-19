# syntax=docker/dockerfile:1.4

########################################
# Stage 1: Builder
########################################
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

########################################
# Stage 2: Runtime
########################################
FROM node:20-alpine AS runtime

WORKDIR /app

RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./
COPY --from=builder /app/app ./app

ENV PORT=8080
EXPOSE 8080

RUN chown -R nodeuser:nodegroup /app
USER nodeuser

CMD ["npm", "start"]
