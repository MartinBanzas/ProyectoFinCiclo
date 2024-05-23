class FileModel {
    id:number;
    path:string;
    description:string;
    type:string;
    size:string;
    date:string;

    constructor (id:number,  description:string, path:string, type:string, size:string, date:string) {
        this.id=id;
        this.path=path;
        this.description=description;
        this.type=type;
        this.size=size;
        this.date=date;
    }
}

export default FileModel;