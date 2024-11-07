import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: `http://${process.env.VITE_FRONTEND_URL}`,
    credentials: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  await app.listen(process.env.NESTJS_APP_DOCKER_PORT).then(() => {
    console.log(`Server started at http://${process.env.VITE_BACKEND_URL}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
