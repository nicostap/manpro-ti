import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as session from 'express-session';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Job } from './job/entities/job.entity';
import { JobModule } from './job/job.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/user.module';

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
          connectionLimit: 10,
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
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: 'your-secret-key',
          resave: false,
          saveUninitialized: false,
          cookie: { maxAge: 3600000 },
        }),
      )
      .forRoutes('*');
  }
}
