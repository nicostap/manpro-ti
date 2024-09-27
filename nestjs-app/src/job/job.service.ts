import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { spawn } from 'child_process';
import { resolve } from 'path';
import sharp from 'sharp';
import { Repository } from 'typeorm';
import { Job, JobType } from './entities/job.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async create(file: Express.Multer.File, type: JobType, user_id: number) {
    const newFilename = 'source.png';
    const directory = `${new Date().toISOString()}-${Math.floor(Math.random() * 1000)}`;
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
      user_id,
      directory,
      type,
    });
    await this.jobRepository.save(newJob);
    const pythonProcess = spawn('python', [
      resolve(__dirname, '..', '..', 'uploads', 'execute.py'),
      directory,
      type,
    ]);
  }

  findOne(id: number) {
    return this.jobRepository.findOne({ where: { id } });
  }
}
