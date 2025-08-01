import { IsEmail, IsInt, IsNotEmpty, Length, MinLength } from 'class-validator';

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


export class VerifyOtpDto{
  @IsEmail()
  @IsNotEmpty()
  email!:string;
 

  @IsNotEmpty()
  @Length(6, 6)
  otp!:string;
}