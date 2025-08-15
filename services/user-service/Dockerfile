FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../libs/proto ./libs/proto

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 50051

# Start the application
CMD ["npm", "run", "start:prod"]
