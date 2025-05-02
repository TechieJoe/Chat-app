import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  socketId?: string;
}