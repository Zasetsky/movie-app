import { IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  readonly username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  readonly password: string;
}
