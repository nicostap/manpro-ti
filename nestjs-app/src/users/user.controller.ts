import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signIn(@Req() req) {
    return { message: 'Logged in', user: req.user };
  }

  @Post('signout')
  async signOut(@Req() req) {
    req.logout();
    return { message: 'Logged out' };
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.usersService.remove(id);
  }
}
