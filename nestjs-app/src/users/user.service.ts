import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        // 'join_date' is handled by the DB, no need to manually set it here.
        const newUser = this.userRepository.create({
            email: createUserDto.email,
            username: createUserDto.username,
            password: createUserDto.password,
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

    async signin(email: string, password: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email, password } });
    }

    async findActive(options: FindOneOptions<User>): Promise<User | null> {
        return await this.userRepository.findOne(options);
    }
}
