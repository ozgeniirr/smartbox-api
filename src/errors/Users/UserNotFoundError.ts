import { BaseError } from "../BaseErrors";

export class UserNotFound extends BaseError{
    constructor(){
        super(404, "Kullanıcı bulunamadı")
    }
}