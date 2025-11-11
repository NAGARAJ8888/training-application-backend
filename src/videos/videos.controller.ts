import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { videoStorage, videoFileFilter, MAX_VIDEO_SIZE } from '../common/config/multer.config';
import { join } from 'path';

@Controller('videos')
@UseGuards(JwtAuthGuard)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('upload')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: videoStorage,
      fileFilter: videoFileFilter,
      limits: { fileSize: MAX_VIDEO_SIZE },
    }),
  )
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
  ) {
    if (!file) {
      throw new BadRequestException('Video file is required');
    }

    const videoData = {
      ...createVideoDto,
      fileUrl: `/uploads/videos/${file.filename}`,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    };

    return this.videosService.create(videoData);
  }

  @Get()
  findAll(@Query('type') type?: string, @Query('moduleId') moduleId?: string) {
    if (moduleId) {
      return this.videosService.findByModule(moduleId);
    }
    if (type && (type === 'module' || type === 'basic')) {
      return this.videosService.findByType(type as 'module' | 'basic');
    }
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }

  @Get(':id/stream')
  async streamVideo(@Param('id') id: string, @Res() res: Response) {
    const video = await this.videosService.findOne(id);
    const filePath = join(process.cwd(), video.fileUrl);
    return res.sendFile(filePath);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: videoStorage,
      fileFilter: videoFileFilter,
      limits: { fileSize: MAX_VIDEO_SIZE },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateData: any = { ...updateVideoDto };

    if (file) {
      updateData.fileUrl = `/uploads/videos/${file.filename}`;
      updateData.fileName = file.originalname;
      updateData.fileSize = file.size;
      updateData.mimeType = file.mimetype;
    }

    return this.videosService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }
}
