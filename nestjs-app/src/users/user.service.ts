import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, FindOneOptions } from 'typeorm';
import { CreateUserDto } from './user.controller';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const newUser = this.userRepository.create({
            email: createUserDto.email,
            username: createUserDto.username,
            password: createUserDto.password,
            join_date: new Date()
        });
        return await this.userRepository.save(newUser);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {
        return await this.userRepository.findOne({ where: { id: Number(id) } });
    }
    
    async remove(id: string): Promise<void> {
        await this.userRepository.delete(Number(id));
    }
    
    async signup(createUserDto: CreateUserDto): Promise<User> {
        const newUser = this.userRepository.create(createUserDto);
        return await this.userRepository.save(newUser);
    }
    

    async signin(email: string, password: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email, password } });
    }

    async findActive(options: FindOneOptions<User>): Promise<User | null> {
        return await this.userRepository.findOne(options);
    }
}
