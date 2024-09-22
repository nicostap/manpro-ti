import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.usersService.create(createUserDto);
    }

    @Post('signin') 
    async signin(@Body() body: { email: string; password: string }): Promise<User | null> {
        const { email, password } = body;
        return await this.usersService.signin(email, password);
    }

    @Get()
    async findAll(): Promise<User[]> {
        return await this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return await this.usersService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return await this.usersService.remove(id);
    }
}
