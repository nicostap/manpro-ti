import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';

export class CreateUserDto {
    firstName: string;
    lastName: string;
  }
  
@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}

