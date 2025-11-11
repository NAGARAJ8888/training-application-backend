import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  title: string;

  @IsString()
  duration: string;

  @IsEnum(['module', 'basic'])
  type: 'module' | 'basic';

  @IsOptional()
  @IsString()
  moduleId?: string;

  @IsOptional()
  @IsString()
  moduleName?: string;
}
