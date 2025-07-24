import { IsInt, Min } from "class-validator";

export class UserIdDto {
  @IsInt({ message: "Smartbox ID bir sayı olmalıdır." })
  @Min(1, { message: "Smartbox ID en az 1 olmalıdır." })
  userId!: number;
}
