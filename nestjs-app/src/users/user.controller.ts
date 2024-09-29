import {
  Body,
  Controller,
  Get,
  Next,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserRequest } from 'src/interfaces';
import { CreateUserDto } from './create-user.dto';
import { LocalGuard } from './local/local.guard';
import { User } from './user.entity';
import { UsersService } from './user.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findCurrentUser(@Req() req: UserRequest) {
    return { user: req.user };
  }

  @Post('signin')
  @UseGuards(LocalGuard)
  async signIn(@Req() req: UserRequest) {
    const { password, ...user } = req.user;
    return { message: 'Logged in', user };
  }

  @Post('signout')
  async signOut(
    @Req() req: UserRequest,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
    return { message: 'Logged out' };
  }
}
