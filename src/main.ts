import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Teste Técnico – Desenvolvedor Backend')
    .setDescription(
      `Este é um teste técnico para a posição de Desenvolvedor Backend, com foco na criação de uma API usando Node.js, TypeScript e NestJS. 
      A API inclui endpoints para gerenciamento de usuários e tutoriais: cadastro e login de usuários (/user/signup, /user/login), e 
      operações CRUD para tutoriais (/tutorial), como listar com filtros, adicionar, editar e remover. É importante lembrar que, quando a 
      rota de listagem de tutoriais possui cache, o cache permanecerá ativo enquanto não houver criação, alteração ou remoção de tutoriais. 
      O cache será atualizado somente quando um desses eventos ocorrer.`,
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
