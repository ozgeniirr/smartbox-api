import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from "class-validator";

export class UpdateSmartboxDto {
  @IsInt()
  @IsPositive()
  smartboxId!: number;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsInt()
  @Min(1)
  capacity!: number;
}
