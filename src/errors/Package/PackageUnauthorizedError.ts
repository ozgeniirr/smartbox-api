import { BaseError } from "../BaseErrors";


export class PackageUnauthorizedError extends BaseError{
    constructor(){
        super(403, "Bu paket size ait değil.")
    }
}