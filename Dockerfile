FROM node:18-alpine

WORKDIR /app

# Copy package files first (better cache)
COPY package.json package-lock.json ./

# Install ALL runtime dependencies
RUN npm ci --ignore-scripts

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy compiled output only
COPY dist ./dist

# Copy proto files expected at runtime
COPY src/grpc/proto ./dist/grpc/proto

EXPOSE 5500

CMD ["node", "dist/server.js"]
