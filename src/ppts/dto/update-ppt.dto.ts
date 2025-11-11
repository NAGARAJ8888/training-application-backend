import { PartialType } from '@nestjs/mapped-types';
import { CreatePPTDto } from './create-ppt.dto';

export class UpdatePPTDto extends PartialType(CreatePPTDto) {}

