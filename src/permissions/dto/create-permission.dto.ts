import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePermissionDTO {
  @IsString()
  @IsNotEmpty()
  code: string; 

  @IsString()
  @IsNotEmpty()
  description: string;
}