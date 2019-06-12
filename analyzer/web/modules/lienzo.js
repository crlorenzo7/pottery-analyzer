class Lienzo{
    lienzo=null;
    paths=[];
    selectedPath=-1;
    selectedPoint=null;
    selectedLine=null;

    addPath(path){
        this.paths.push(path);
    }
    reset(){
        this.lienzo=null;
        this.paths=[];
        this.selectedPath=-1;
        this.selectedPoint=null;
        this.selectedLine=null;
    }
    
    paint(){
        var ctx=this.lienzo.getContext("2d");
        ctx.clearRect(0,0,this.lienzo.width,this.lienzo.height);
        ctx.putImageData(app.newModelAssistant.imageData,0,0);
        ctx.lineWidth=1;
        ctx.strokeStyle='red';
        for(var i=0;i<this.paths.length;i++){
            this.paths[i].print(ctx,true);
        }
        
    }

    isInPath(x,y){
        var inPath=[];
        var ctx=this.lienzo.getContext("2d");
        for(var i=this.paths.length-1;i>=0;i--){
            if(this.paths[i].isInPath(ctx,x,y)){
                inPath.push(i);
            }
        }
        return inPath;
    }

    isInStroke(x,y){
        var inPath=[];
        var ctx=this.lienzo.getContext("2d");
        for(var i=this.paths.length-1;i>=0;i--){
            if(this.paths[i].isInStroke(ctx,x,y)){
                inPath.push(i);
            }
        }
        return inPath;
    }
    
}

class Path{
    points=[];
    lines=[];
    constructor(points){
        this.points=points;
        this.generateLines();
    }

    generateLines(){
        this.lines=[];
        for(var i=0;i<this.points.length;i++){
            if(i==this.points.length-1){
                var l=new Line(this.points[i],this.points[0]);
            }else{
                var l=new Line(this.points[i],this.points[i+1]);
            }
            console.log(l);
            this.lines.push(l);
        }
    }

    getPoints(){
        return this.points;
    }


    print(ctx,conPuntos=false){
        for(var i=0;i<this.lines.length;i++){
            this.lines[i].print(ctx);
        }
        ctx.strokeStyle='blue';
        ctx.fillStyle='white';
        if(conPuntos){
            for(var i=0;i<this.points.length;i++){
                this.points[i].print(ctx);
            }
        }
    }

    isInPath(ctx,x,y){
        var encontrado=false;
        for(var i=0;i<this.points.length && !encontrado;i++){
            if(this.points[i].isPointInCircle(ctx,x,y)){
                encontrado=true;
                app.newModelAssistant.lienzo.selectedPoint=i;
            }
        }
        return encontrado;
    }

    isInStroke(ctx,x,y){
        var encontrado=false;
        for(var i=0;i<this.lines.length && !encontrado;i++){
            if(this.lines[i].isPointInLine(ctx,x,y)){
                encontrado=true;
                app.newModelAssistant.lienzo.selectedLine=i;
            }
        }
        return encontrado;
    }

    actualizarPunto(punto){
        for(var i=0;i<this.lines.length;i++){
            var isInLine=this.lines[i].containsPoint(this.points[app.newModelAssistant.lienzo.selectedPoint]);
            if(isInLine!=-1){
                if(isInLine==0){
                    this.lines[i].setOrigen(punto);
                }else{
                    this.lines[i].setDestino(punto);
                }
            }
        }
        this.points[app.newModelAssistant.lienzo.selectedPoint]=punto;
    }

    addPoint(punto){
        var line=this.lines[app.newModelAssistant.lienzo.selectedLine];
        console.log(line);
        if(!line.getOrigen().isEqual(punto) && !line.getDestino().isEqual(punto)){
            var encontrado=false;
            for(var i=0;i<this.points.length && !encontrado;i++){
                if(this.points[i].isEqual(line.getOrigen())){
                    encontrado=true;
                    if(i==this.points.length-1){
                        this.points.splice(0,0,punto);
                    }else{
                        this.points.splice((i+1),0,punto);
                    }
                }
            }

        }
        this.generateLines();
        app.newModelAssistant.lienzo.paint();
    }
}

class Line{
    origen=null;
    destino=null;
    constructor(o,d){
        this.origen=o;
        this.destino=d;
    }

    print(ctx){
        ctx.beginPath();
        ctx.moveTo(this.origen.getX(),this.origen.getY());
        ctx.lineTo(this.destino.getX(),this.destino.getY());
        ctx.stroke();
    }

    setOrigen(p){
        this.origen=p;
    }

    setDestino(p){
        this.destino=p;
    }

    getOrigen(){
        return this.origen;
    }

    getDestino(){
        return this.destino;
    }

    containsPoint(point){
       
        if(this.origen.isEqual(point)){
            return 0;
        }
        if(this.destino.isEqual(point)){
            return 1;
        }
        return -1;
    }

    isPointInLine(ctx,x,y){
        var line=new Path2D();
        line.moveTo(this.origen.x,this.origen.y);
        line.lineTo(this.destino.x,this.destino.y);
        ctx.lineWidth=10;
        //ctx.stroke(line);
        var res=ctx.isPointInStroke(line,x,y);
        
        return res;
    }

}

class Point{
    x=null;
    y=null;
    constructor(x,y){
        this.x=x;
        this.y=y;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    setX(x){
        this.x=x;
    }

    setY(y){
        this.y=y;
    }

    print(ctx){
        ctx.beginPath();
        ctx.arc(this.x,this.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

    isPointInCircle(ctx,x,y){
        var circle=new Path2D();
        circle.arc(this.x,this.y, 5, 0, 2 * Math.PI);
        return ctx.isPointInPath(circle,x,y);
    }

    isEqual(point){
        return (this.x==point.getX()) && (this.y==point.getY());
    }
}