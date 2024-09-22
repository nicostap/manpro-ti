import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { join, resolve } from 'path';
import sharp from 'sharp';
import { spawn } from 'child_process';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async create(file: Express.Multer.File) {
    const newFilename = 'source.png';
    const directory = new Date().toISOString();
    const outputPath = resolve(
      __dirname,
      '..',
      '..',
      'uploads',
      directory,
      newFilename,
    );
    await sharp(file.buffer).png({ quality: 100 }).toFile(outputPath);
    const newJob = this.jobRepository.create({
      user_id: 1,
      directory,
    });
    await this.jobRepository.save(newJob);
    const pythonProcess = spawn('python', [
      resolve(__dirname, '..', '..', 'uploads', 'model/execute.py'),
      directory,
    ]);
  }

  findOne(id: number) {
    return this.jobRepository.findOne({ where: { id } });
  }
}
