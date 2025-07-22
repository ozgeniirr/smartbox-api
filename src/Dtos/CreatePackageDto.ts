import { IsInt, IsPositive, IsString, MinLength } from "class-validator";

export class CreatePackageDto {
  @IsString()
  sender!: string;

  @IsString()
  content!: string;

  @IsInt()
  @IsPositive()
  smartboxId!: number;
}

