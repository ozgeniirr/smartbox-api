import { BaseError } from "../BaseErrors";

export class PackageNotFoundError extends BaseError{
    constructor(){
        super(404,"Paket bulunamadı.")
    }
}