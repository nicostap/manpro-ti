import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import * as sharp from 'sharp';
import { Repository } from 'typeorm';
import { Job, JobType } from './entities/job.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async create(file: Express.Multer.File, type: JobType, user_id: number) {
    const fileName = 'source.png';
    const directory = `${new Date().toISOString()}-${Math.floor(Math.random() * 1000)}`;
    const directoryPath = resolve(__dirname, '..', 'uploads', directory);

    void this.saveFile(file, directoryPath, fileName).then(() => {
      spawn('/usr/bin/python3', [
        resolve(__dirname, '..', 'uploads', 'execute.py'),
        directory,
        type,
      ]).on('error', function (err) {
        Logger.error('Image generation error: ' + err);
      });
    });

    const newJob = this.jobRepository.create({
      user_id,
      directory,
      type,
    });
    const savedJob = await this.jobRepository.save(newJob);
    return savedJob.id;
  }

  findOne(id: number) {
    return this.jobRepository.findOne({ where: { id } });
  }

  private async saveFile(
    file: Express.Multer.File,
    directoryPath: string,
    fileName: string,
  ) {
    if (!existsSync(directoryPath)) {
      mkdirSync(directoryPath, { recursive: true });
    }
    await sharp(file.buffer)
      .png({ quality: 100 })
      .toFile(resolve(directoryPath, fileName));
  }
}
