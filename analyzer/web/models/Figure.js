class Figure extends BaseModel{
    altura=0.0;
    diametro=0.0;
    volumen=0.0;
    capacidad=0.0;
    imagen="";
    textura="";
    datos=[];

    constructor(figureJson=null){
        super();
        if(figureJson!=null){
            this.fromJson(figureJson);
        }
    }
}