import { BaseError } from "../BaseErrors";

export class PackageAlreadyPickedError extends BaseError{
    constructor(){
        super(409, "Paket zaten alınmış.")
    }
}