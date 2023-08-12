class CustomeError extends Error{
    public code: number;
    public data?: any;
    constructor(code: number, message: string, data?:any){
        super(message);
        this.code = code;
        this.data = data
    }
}

export default CustomeError
