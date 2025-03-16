# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy source code
COPY ./dist .

# Set environment variable
ENV WS_PORT=8080

# Expose WebSocket port
EXPOSE 8080

# Start WebSocket server
CMD ["node", "index.js"]
