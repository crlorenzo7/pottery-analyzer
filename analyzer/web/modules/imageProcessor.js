class ImageProccessor{
    constructor(){

    }
    _canny(imdata,r,lt,ht){
        var width=imdata.width;
        var height=imdata.height;
        var img_w = new jsfeat.matrix_t(width, height, jsfeat.U8C1_t);
        jsfeat.imgproc.grayscale(imdata.data, width, height, img_w);
        

        
        var kernel_size = (r+1) << 1;

        jsfeat.imgproc.gaussian_blur(img_w, img_w, kernel_size, 0);
        jsfeat.imgproc.canny(img_w, img_w,lt, ht);


        var data_u32 = new Uint32Array(imdata.data.buffer);
        var alpha = (0xff << 24);
        var i = img_w.cols*img_w.rows, pix = 0;
        while(--i >= 0) {
            pix = img_w.data[i];
            data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
        }
    }
    _umbralizar(imData,umbral){
        var pixels=imData.data;
        for(var i=0;i<pixels.length;i+=4){
            if(pixels[i]<umbral){
                pixels[i]=pixels[i+1]=pixels[i+2]=255;
            }else{
                pixels[i]=pixels[i+1]=pixels[i+2]=0;
            }
        }
        
    }
    _extraerBordes(){
        this._canny(app.newModelAssistant.imageData,2,70,127);

        var canvasR=document.getElementById('eje-simetria');
        var ctxR=canvasR.getContext('2d');
        ctxR.putImageData(app.newModelAssistant.imageData,0,0);
        var imgBase64=canvasR.toDataURL('image/png',1.0);
        console.log(imgBase64);
        var imagen={};
        imagen['imagen']=imgBase64;
        var datos={};
        datos['datos']=JSON.stringify(imagen);

        
        app._getLoaderView('creando modelo...');
        Api._analizar(datos).done(
            data => {
                $('#wrapper-loader').fadeOut(500);
                var width=app.newModelAssistant.ejeX;
                console.log(width);
                var height=app.newModelAssistant.canvas.height;
                console.log(data);
                var profileData=data
                console.log(profileData);
                app.setAnalyzedData(profileData.w,profileData.h,profileData.diff);
                console.log(profileData.datos[0][0]);
                var points=[];
                var pactual=0;
                for(var i=profileData.datos.length-1;i>=0;i--){
                    if(i==0){
                        var punto=new Point(width-profileData.datos[i][0],height-profileData.datos[i][1]);
                        points.push(punto);
                    }else{
                        if((Math.abs(profileData.datos[pactual][0]-profileData.datos[i][0])>10) || (Math.abs(profileData.datos[pactual][1]-profileData.datos[i][1])>10)){
                            var punto=new Point(width-profileData.datos[i][0],height-profileData.datos[i][1]);
                            points.push(punto);
                            pactual=i;
                        }
                    }
                }
                var path=new Path(points);
                app.newModelAssistant.lienzo.lienzo=document.getElementById('figura-completa');
                app.newModelAssistant.lienzo.addPath(path);
                app.newModelAssistant.lienzo.paint();
                
                
                $('#figura-completa').unbind();
                $('#figura-completa').mousedown(function(e){
                    var x=e.offsetX;
                    var y=e.offsetY;
                    var pathPoint=app.newModelAssistant.lienzo.isInPath(x,y);
                    if(pathPoint.length>0){
                        app.newModelAssistant.lienzo.selectedPath=pathPoint[0];
                    }
            
                }).mousemove(function(e){
                    if(app.newModelAssistant.lienzo.selectedPoint!=null){
                        var x=e.offsetX;
                        var y=e.offsetY;
                        app.newModelAssistant.lienzo.paths[app.newModelAssistant.lienzo.selectedPath].actualizarPunto(new Point(x,y));
                        app.newModelAssistant.lienzo.paint();
                    }
            
                }).mouseup(function(){
                    app.newModelAssistant.lienzo.selectedPath=-1;
                    app.newModelAssistant.lienzo.selectedPoint=null;
                });
            
                $('#figura-completa').dblclick(function(e){
                    var x=e.offsetX;
                    var y=e.offsetY;
                    var linePath=app.newModelAssistant.lienzo.isInStroke(x,y);
                    console.log(linePath);
                    if(linePath.length>0){
                        app.newModelAssistant.lienzo.paths[linePath[0]].addPoint(new Point(x,y));
                    }
                });
                
              
                
            }
        ).fail(
            err => {
                app.gesLoader._changeLoaderMessage('error al crear el modelo');
                window.setTimeout(function(){$('#wrapper-loader').fadeOut(500);},3000);
                console.log(err);
            }
        )
    }
    _aplicarFiltro(matriz){
        var imData=app.newModelAssistant.imageData;
        var pixels=imData.data;

        var pivot=[Math.floor(matriz.length/2),Math.floor(matriz[0].length/2)];

        for(var i=0;i<imData.height;i++){
            for(var j=0;j<(imData.width*4);j+=4){
                var resultados=[];
                var index=(i*imData.width*4)+j;
                for(k=0;k<matriz.length;k++){
                    for(l=0;l<matriz[0].length;l++){
                        var oh=k-pivot[0];
                        var ow=l-pivot[1];
                        var indicePixel=((i+oh)*imData.width*4)+(j+(ow*4));
                        if((i+oh)>=0 && (j+(ow*4))>=0){
                            resultados.push(matriz[k][l]*pixels[indicePixel]);
                        }
                    }
                }
                var total=0;
                for(k=0;k<resultados.length;k++){
                    total+=resultados[k];
                }
                pixels[index]=pixels[index+1]=pixels[index+2]=total;
            }
        }
    }
}