import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Monitoring Reports')
    .setDescription(
      `
API responsible for generating academic reports for teachers and rooms.  

**Authentication:**  
All endpoints require the \`x-api-key\` header with a valid key. 

**Main features:**  
- Check the committed workload of each teacher.  
- List the rooms with busy and free times on a given day of the week.  

Use the endpoints below to access available reports.
  `,
    )
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  console.log(
    'Listening on http://localhost:3000 - Swagger: http://localhost:3000/api',
  );
}
bootstrap();
