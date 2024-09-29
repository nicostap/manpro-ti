import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './local/local.strategy';
import { UsersController } from './user.controller';
import { User } from './user.entity';
import { UsersService } from './user.service';
@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule],
  controllers: [UsersController],
  providers: [UsersService, LocalStrategy],
  exports: [UsersService],
})
export class UsersModule {}
