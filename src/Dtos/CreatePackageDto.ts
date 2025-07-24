import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  receiver!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsInt()
  @IsPositive()
  smartboxId!: number;

}
