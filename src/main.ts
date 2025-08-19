import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const Port = Number(process.env.PORT) || 5000
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
    methods: "GET, DELETE, POST, PATCH",
    preflightContinue: false,
  })
  app.setGlobalPrefix('api');
  await app.listen(Port, ()=> {
    console.log(`Server started on Port ${Port}`);
    
  });
}
bootstrap();
