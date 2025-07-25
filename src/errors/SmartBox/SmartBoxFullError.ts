import { BaseError } from "../BaseErrors";


export class SmartBoxFullError extends BaseError{
    constructor(){
        super(409, "SmartBox dolu.")

    }
}