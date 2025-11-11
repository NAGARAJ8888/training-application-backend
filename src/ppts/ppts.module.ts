import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PPTsService } from './ppts.service';
import { PPTsController } from './ppts.controller';
import { PPT, PPTSchema } from './schemas/ppt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PPT.name, schema: PPTSchema }]),
  ],
  controllers: [PPTsController],
  providers: [PPTsService],
  exports: [PPTsService],
})
export class PPTsModule {}

