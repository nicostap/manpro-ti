import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { createClient } from 'redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Job } from './job/entities/job.entity';
import { JobModule } from './job/job.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/user.module';
import { UsersService } from './users/user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        name: 'default',
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Job],
        synchronize: false,
        extra: {
          connectionLimit: 150,
        },
      }),
    }),
    UsersModule,
    JobModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly userService: UsersService) {}

  async configure(consumer: MiddlewareConsumer) {
    const redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      legacyMode: false,
    });
    (await redisClient.connect()).on('error', function (err) {
      Logger.error('Redis connection error: ' + err);
      throw err;
    });
    consumer
      .apply(
        session({
          secret: process.env.SESSION_SECRET_KEY,
          resave: false,
          saveUninitialized: false,
          cookie: {
            sameSite: true,
            httpOnly: false,
            maxAge: 3600 * 1000,
          },
          store: new RedisStore({
            client: redisClient,
          }),
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
    passport.serializeUser((user: User, done) => {
      done(null, user.id);
    });
    passport.deserializeUser(async (id: number, done) => {
      const user = await this.userService.findOne(id);
      if (!user) {
        return done(new Error('User not found'), null);
      }
      done(null, user);
    });
  }
}
