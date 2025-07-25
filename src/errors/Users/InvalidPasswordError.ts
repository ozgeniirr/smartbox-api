import { BaseError } from "../BaseErrors";

export class InvalidPassword extends BaseError{
    constructor(){
        super(401,"Şifre hatalı.")
    }
}