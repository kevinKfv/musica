# Stage 1: Build Vite React SPA
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source code and build
COPY . .

# Pass backend API URL at build time if provided
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Railway dynamically assigns $PORT
ENV PORT=80

COPY --from=builder /app/dist /usr/share/nginx/html

# Use official nginx template feature (envsubst runs automatically on templates)
RUN mkdir -p /etc/nginx/templates
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
