import { IsInt, Min } from "class-validator";

export class GetSmartboxDto {
  @IsInt({ message: "Smartbox ID bir sayı olmalıdır." })
  @Min(1, { message: "Smartbox ID en az 1 olmalıdır." })
  smartboxId!: number;
}
