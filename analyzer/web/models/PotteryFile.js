class PotteryFile extends BaseModel{
    id="";
    tipo="carpeta";
    titulo="";
    fechaCreacion=new Date().getTime();
    idPadre="";
    idUsuario="";
    figura=null;
    next=0;

    constructor(fileJson=null){
        super();
        if(fileJson!=null){
            this.fromJson(fileJson);
        }
    }

}