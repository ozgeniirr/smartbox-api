import { BaseError } from "../BaseErrors";

export class SmartBoxNotAvailable extends BaseError{
    constructor(){
        super(403, "SmartBox şuan uygun değil.");
    }
}