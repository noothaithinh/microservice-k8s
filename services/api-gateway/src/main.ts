import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for GraphQL playground
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`API Gateway is running on: ${await app.getUrl()}`);
  console.log(`GraphQL Playground: ${await app.getUrl()}/graphql`);
}

bootstrap().catch(console.error);
