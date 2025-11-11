import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PPT, PPTDocument } from './schemas/ppt.schema';
import { CreatePPTDto } from './dto/create-ppt.dto';
import { UpdatePPTDto } from './dto/update-ppt.dto';

@Injectable()
export class PPTsService {
  constructor(
    @InjectModel(PPT.name)
    private pptModel: Model<PPTDocument>,
  ) {}

  async create(createPPTDto: any): Promise<PPT> {
    const ppt = new this.pptModel(createPPTDto);
    return ppt.save();
  }

  async findAll(): Promise<PPT[]> {
    return this.pptModel.find().exec();
  }

  async findOne(id: string): Promise<PPT> {
    const ppt = await this.pptModel.findById(id).exec();
    if (!ppt) {
      throw new NotFoundException('PPT not found');
    }
    return ppt;
  }

  async findByModule(moduleId: string): Promise<PPT[]> {
    return this.pptModel.find({ moduleId }).exec();
  }

  async update(id: string, updatePPTDto: any): Promise<PPT> {
    const ppt = await this.pptModel
      .findByIdAndUpdate(id, updatePPTDto, { new: true })
      .exec();

    if (!ppt) {
      throw new NotFoundException('PPT not found');
    }

    return ppt;
  }

  async remove(id: string): Promise<void> {
    const result = await this.pptModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('PPT not found');
    }
  }
}
