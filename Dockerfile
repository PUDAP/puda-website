# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG SITE_URL
ARG PUBLIC_TINA_CLIENT_ID
ARG TINA_TOKEN
ARG GITHUB_BRANCH=main

ENV SITE_URL=$SITE_URL \
    PUBLIC_TINA_CLIENT_ID=$PUBLIC_TINA_CLIENT_ID \
    TINA_TOKEN=$TINA_TOKEN \
    GITHUB_BRANCH=$GITHUB_BRANCH

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
