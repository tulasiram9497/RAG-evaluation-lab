# Multi-stage Dockerfile for RAG Evaluation Lab
FROM node:22-bookworm-slim AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application sources
COPY . .

# Build frontend and server
RUN npm run build

# Expose port 3000
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["npm", "start"]
