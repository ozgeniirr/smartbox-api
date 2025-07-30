import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @MinLength(6)
  @IsNotEmpty()
  password!: string;
}


export class LoginDto {
  @IsEmail()
  email!: string;

  @MinLength(6)
  @IsNotEmpty()
  password!: string;
}

export class UserDto {
  @IsEmail()
  email!:string;
}