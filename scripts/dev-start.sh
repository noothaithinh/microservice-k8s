#!/bin/bash

echo "🚀 Starting Microservices Development Environment..."

# Navigate to project root
cd "$(dirname "$0")/.."

echo "📁 Working from: $(pwd)"

# Check if we have the services directory
if [ ! -d "services" ]; then
    echo "❌ Error: services directory not found!"
    exit 1
fi

echo "📦 Found services:"
ls -la services/

# Start Docker services first
echo "📡 Starting Kafka and Zookeeper..."
docker-compose up -d zookeeper kafka

echo "⏳ Waiting for Kafka to be ready..."
sleep 15

# Simple approach: start services in background
echo "👤 Starting User Service..."
(cd services/user-service && npm run start:dev > /tmp/user-service.log 2>&1) &
USER_PID=$!
echo "   User Service PID: $USER_PID"
sleep 3

echo "📦 Starting Product Service..."
(cd services/product-service && npm run start:dev > /tmp/product-service.log 2>&1) &
PRODUCT_PID=$!
echo "   Product Service PID: $PRODUCT_PID"
sleep 3

echo "🛒 Starting Order Service..."  
(cd services/order-service && npm run start:dev > /tmp/order-service.log 2>&1) &
ORDER_PID=$!
echo "   Order Service PID: $ORDER_PID"

echo "⏳ Waiting for microservices to start..."
sleep 10

echo "🌐 Starting API Gateway..."
(cd services/api-gateway && npm run start:dev > /tmp/api-gateway.log 2>&1) &
GATEWAY_PID=$!
echo "   API Gateway PID: $GATEWAY_PID"

echo "✅ All services started!"
echo ""
echo "🔗 Service URLs:"
echo "   GraphQL Playground: http://localhost:3000/graphql"
echo "   User Service: gRPC on localhost:50051"
echo "   Product Service: gRPC on localhost:50052"
echo "   Order Service: gRPC on localhost:50053"
echo ""
echo "📊 Process IDs:"
echo "   User Service: $USER_PID"
echo "   Product Service: $PRODUCT_PID"  
echo "   Order Service: $ORDER_PID"
echo "   API Gateway: $GATEWAY_PID"
echo ""
echo "� Log files:"
echo "   User Service: /tmp/user-service.log"
echo "   Product Service: /tmp/product-service.log"
echo "   Order Service: /tmp/order-service.log"
echo "   API Gateway: /tmp/api-gateway.log"
echo ""
echo "�🛑 To stop: npm run dev:stop"

# Check if API Gateway started successfully
sleep 5
if ! lsof -i:3000 > /dev/null; then
    echo "❌ API Gateway failed to start. Check logs:"
    echo "   tail -f /tmp/api-gateway.log"
fi

# Keep script running
wait
