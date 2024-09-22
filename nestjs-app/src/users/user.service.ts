import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
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

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id: Number(id) } });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(Number(id));
  }

  async validate(email: string, password: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email, password },
    });
  }
}
