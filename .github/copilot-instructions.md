<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Microservices Architecture Instructions

This is a microservices project built with NestJS, GraphQL, gRPC, and Kafka. The project structure follows these conventions:

## Architecture
- **API Gateway**: GraphQL federation layer that communicates with microservices via gRPC
- **User Service**: Handles user management with gRPC server
- **Product Service**: Manages products with gRPC server
- **Order Service**: Handles order processing with gRPC server
- **Shared Libraries**: Common proto files for gRPC communication

## Technology Stack
- **Framework**: NestJS
- **API Layer**: GraphQL with Apollo Server
- **Inter-service Communication**: gRPC
- **Event Streaming**: Apache Kafka
- **Database**: TypeORM with SQLite (for development)
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Development Guidelines
1. All microservices should implement gRPC servers using the proto files in `libs/proto/`
2. The API Gateway should only expose GraphQL resolvers and communicate with services via gRPC
3. Use TypeORM entities for database models
4. Follow NestJS conventions for modules, controllers, and services
5. Each service should have its own Docker container
6. Use Kafka for asynchronous event-driven communication between services

## File Structure
- `services/` - Individual microservices
- `libs/proto/` - Shared gRPC protocol definitions
- `k8s/` - Kubernetes deployment manifests
- `docker-compose.yml` - Local development setup

When working on this project, always consider the microservices architecture patterns and ensure proper separation of concerns.
