import { BaseError } from "../BaseErrors";


export class UserEmailExistsError extends BaseError{
    constructor(){
        super(409, "Bu email zaten kayıtlı.")
    }
}