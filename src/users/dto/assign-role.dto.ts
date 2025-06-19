import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AssignRoleToUserDTO {
  @IsArray()
  @IsString({ each: true }) 
  @IsNotEmpty({ each: true })
  roleName: string; 
}