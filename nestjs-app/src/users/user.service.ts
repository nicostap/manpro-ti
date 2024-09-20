import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, FindOneOptions } from 'typeorm';
import { CreateUserDto } from './user.controller';

@Injectable()
export class UsersService {
    remove(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<User[]> {
        throw new Error('Method not implemented.');
    }
    create(createUserDto: CreateUserDto): Promise<User> {
        throw new Error('Method not implemented.');
    }
    findOne(id: string): Promise<User> {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async signup(email: string, password: string): Promise<User> {
        const newUser = this.userRepository.create({ email, password });
        return await this.userRepository.save(newUser);
    }

    async signin(email: string, password: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email, password } });
    }

    async findActive(options: FindOneOptions<User>): Promise<User | null> {
        return await this.userRepository.findOne(options);
    }
}
