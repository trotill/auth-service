import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFile } from 'fs/promises';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import jwtKeys from './utils/keys';
async function bootstrap() {
  await jwtKeys.init();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Authority service openApi')
    .setDescription('API Docs')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  await writeFile('./swagger/swagger.json', JSON.stringify(document));
  const port = process.env.HTTP_PORT ?? 7777;
  await app.listen(port);
  console.log(`listen ${port}`);
}
bootstrap();
