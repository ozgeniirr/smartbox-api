import { BaseError } from "../BaseErrors";


export class EmailNotMatchError extends BaseError{
    constructor(){
        super(403, "Bu email geçerli değil.")
    }
}