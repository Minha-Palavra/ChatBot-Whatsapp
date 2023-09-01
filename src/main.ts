import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ChatBot MinhaPalavra')
    .setDescription('The MinhaPalavra ChatBot API description')
    .setVersion('1.0')
    .addTag('chatbot')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(8080);
  console.log(`Application is running on: http://localhost:8080/documentation`);
}

bootstrap();
