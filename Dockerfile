# Stage 1: Build the Angular app
FROM node:22.11.0 AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Angular application for SSR
RUN npm run build

# Stage 2: Run the SSR app
FROM node:22.11.0 AS server

WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm install --production

# Expose the application port
EXPOSE 4000

# Start the SSR server
CMD ["node", "dist/server/server.mjs"]
