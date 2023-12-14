import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFile } from 'fs/promises';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import jwtKeys from './utils/keys';
import { SAVE_SWAGGER, SHOW_API_DOCS } from './utils/const';
async function bootstrap(): Promise<void> {
  await jwtKeys.init();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Authority service openApi')
    .setDescription('API Docs')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  if (+SHOW_API_DOCS) SwaggerModule.setup('/api/docs', app, document);
  if (+SAVE_SWAGGER)
    await writeFile('./swagger/swagger.json', JSON.stringify(document));
  const port = process.env.LISTEN_HTTP_PORT ?? 7777;
  await app.listen(port);
  console.log(`listen ${port}`);
}
bootstrap();
