import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from './schemas/video.schema';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name)
    private videoModel: Model<VideoDocument>,
  ) {}

  async create(createVideoDto: any): Promise<Video> {
    const video = new this.videoModel(createVideoDto);
    return video.save();
  }

  async findAll(): Promise<Video[]> {
    return this.videoModel.find().exec();
  }

  async findOne(id: string): Promise<Video> {
    const video = await this.videoModel.findById(id).exec();
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    return video;
  }

  async findByModule(moduleId: string): Promise<Video[]> {
    return this.videoModel.find({ moduleId }).exec();
  }

  async findByType(type: 'module' | 'basic'): Promise<Video[]> {
    return this.videoModel.find({ type }).exec();
  }

  async update(id: string, updateVideoDto: any): Promise<Video> {
    const video = await this.videoModel
      .findByIdAndUpdate(id, updateVideoDto, { new: true })
      .exec();

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return video;
  }

  async remove(id: string): Promise<void> {
    const result = await this.videoModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Video not found');
    }
  }
}
