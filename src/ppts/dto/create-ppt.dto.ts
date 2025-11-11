import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePPTDto {
  @IsString()
  title: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  slides: number;

  @IsString()
  moduleId: string;

  @IsOptional()
  @IsString()
  moduleName?: string;
}
