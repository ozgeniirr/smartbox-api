import { BaseError } from "../BaseErrors";


export class EmailNotVerifiedError extends BaseError{
    constructor(){
        super(404, 'Email doğrulanmamış.')
    }
}