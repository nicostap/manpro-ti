import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { LocalStrategy } from './local-strategy.passport';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule],
  controllers: [UsersController],
  providers: [UsersService, LocalStrategy],
})
export class UsersModule {}
