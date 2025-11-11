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
import { PPTsService } from './ppts.service';
import { CreatePPTDto } from './dto/create-ppt.dto';
import { UpdatePPTDto } from './dto/update-ppt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { pptStorage, pptFileFilter, MAX_PPT_SIZE } from '../common/config/multer.config';
import { join } from 'path';

@Controller('ppts')
@UseGuards(JwtAuthGuard)
export class PPTsController {
  constructor(private readonly pptsService: PPTsService) {}

  @Post('upload')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: pptStorage,
      fileFilter: pptFileFilter,
      limits: { fileSize: MAX_PPT_SIZE },
    }),
  )
  async uploadPPT(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPPTDto: CreatePPTDto,
  ) {
    if (!file) {
      throw new BadRequestException('PPT file is required');
    }

    const pptData = {
      ...createPPTDto,
      fileUrl: `/uploads/ppts/${file.filename}`,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    };

    return this.pptsService.create(pptData);
  }

  @Get()
  findAll(@Query('moduleId') moduleId?: string) {
    if (moduleId) {
      return this.pptsService.findByModule(moduleId);
    }
    return this.pptsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pptsService.findOne(id);
  }

  @Get(':id/download')
  async downloadPPT(@Param('id') id: string, @Res() res: Response) {
    const ppt = await this.pptsService.findOne(id);
    const filePath = join(process.cwd(), ppt.fileUrl);
    return res.download(filePath);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: pptStorage,
      fileFilter: pptFileFilter,
      limits: { fileSize: MAX_PPT_SIZE },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePPTDto: UpdatePPTDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateData: any = { ...updatePPTDto };

    if (file) {
      updateData.fileUrl = `/uploads/ppts/${file.filename}`;
      updateData.fileName = file.originalname;
      updateData.fileSize = file.size;
      updateData.mimeType = file.mimetype;
    }

    return this.pptsService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.pptsService.remove(id);
  }
}
