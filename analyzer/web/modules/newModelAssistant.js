class SizeSelection{
    arrastrando=false;
    origen={x:null,y:null};
    dimension={w:0,h:0};
}

class NewModelAssistant{
    step=0;
    canvas=null;
    context=null;
    imageDataAnterior=[];
    imageData=null;
    ejeX=null;
    escalaImageData=null;
    lienzo=null;
    seleccionEscala=null;

    
    constructor(){
        this.lienzo=new Lienzo();
        this.seleccionEscala=new SizeSelection();
    }

    
}