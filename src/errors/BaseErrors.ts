

export class BaseError extends Error{
    statusCode:number;
    constructor(statusCode:number, message:string){
        super(message);
        this.statusCode=statusCode;
        this.name = new.target.name; 
        Error.captureStackTrace(this, this.constructor);
    }



}