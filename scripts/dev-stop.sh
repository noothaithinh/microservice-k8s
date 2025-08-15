#!/bin/bash

# Stop all development services

echo "🛑 Stopping all microservices..."

# Kill all NestJS processes more aggressively
echo "💀 Stopping NestJS services..."
pkill -f "nest start" || true
pkill -f "npm run start:dev" || true

# Kill specific service processes
echo "💀 Stopping service processes..."
pkill -f "user-service" || true
pkill -f "product-service" || true
pkill -f "order-service" || true
pkill -f "api-gateway" || true

# Kill any processes using our ports
echo "💀 Freeing up ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:50051 | xargs kill -9 2>/dev/null || true
lsof -ti:50052 | xargs kill -9 2>/dev/null || true
lsof -ti:50053 | xargs kill -9 2>/dev/null || true

# Stop Docker containers
echo "📦 Stopping Docker containers..."
docker-compose down

# Clean up log files
echo "🧹 Cleaning up log files..."
rm -f /tmp/user-service.log /tmp/product-service.log /tmp/order-service.log /tmp/api-gateway.log

echo "✅ All services stopped successfully!"
