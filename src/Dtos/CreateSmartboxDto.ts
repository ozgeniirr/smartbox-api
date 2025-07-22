import { IsBoolean, IsInt, IsPositive, IsString, MinLength } from "class-validator";

export class CreateSmartboxDto{
    @IsString()
    location!:string;

    @IsBoolean()
    isActive!:boolean;

    @IsInt()
    @IsPositive()
    capacity!:number;
}

