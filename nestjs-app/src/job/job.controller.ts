import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { resolve } from 'path';
import { UserRequest } from 'src/interfaces';
import { AuthGuard } from 'src/users/auth.guard';
import { JobType } from './entities/job.entity';
import { JobService } from './job.service';

@UseGuards(AuthGuard)
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: JobType,
    @Req() req: UserRequest,
  ) {
    const jobId = await this.jobService.create(file, type, req.user.id);
    return { jobId };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Req() req: UserRequest,
    @Res() res: Response,
  ) {
    const job = await this.jobService.findOne(id);
    if (!job || job.user_id != req.user.id) {
      throw new NotFoundException('Job not found');
    }
    const imagePath = resolve(
      __dirname,
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
