


export class BaseError extends Error{
    statusCode:string;
    constructor(statusCode:string, message:string){
        super(message);
        this.statusCode=statusCode;
    }



}