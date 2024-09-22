import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as session from 'express-session';
import * as passport from 'passport';
import { User } from './users/user.entity';
import { getConnection } from 'typeorm';
import { UsersService } from './users/user.service';

declare const module: any;

async function bootstrap() {
  const port = process.env.NESTJS_APP_DOCKER_PORT;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    const userService = app.get(UsersService);
    const user = await userService.findOne(id);
    if (!user) {
      return done(new Error('User not found'), null);
    }
    done(null, user);
  });

  await app.listen(port).then(() => {
    console.log(`Server started at http://localhost:${port}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
