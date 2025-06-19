import { IsString, IsOptional } from 'class-validator';

export class UpdatePermissionDTO {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;
}