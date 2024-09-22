import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { resolve } from 'path';
import { JobService } from './job.service';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    return this.jobService.create(file);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const job = await this.jobService.findOne(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    const imagePath = resolve(
      __dirname,
      '..',
      '..',
      'uploads',
      job.directory,
      'result.png',
    );

    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    } else {
      throw new NotFoundException('Job is still pending');
    }
  }
}
