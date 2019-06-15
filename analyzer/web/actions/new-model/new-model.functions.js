var movingAction=true;
var pointInitial=null;
var indexMoving=null;

var newModelFunctions={
    _reset(){
        app.newModelAssistant=new NewModelAssistant();
    },
    _moverScroller(n){
        $('#snmp').animate({'left':-(100*n)+'%'},500);
    },
    _seleccionarStep(n){
        if(app.newModelAssistant.step>n){
            $($('#steps-list .item[data-order="'+(n+1)+'"]')[0]).attr('data-estado','inactivo');
        }
        var item=$('#steps-list .item[data-order="'+n+'"]')[0];
        var titulo=$(item).find('.label').html().trim();
        $('#sts').html(titulo);
        $(item).attr('data-estado','activo');
        var prop=100/3.0;
        $('#progress-process').animate({'width':(prop*(n+1))+'%'},300);
    },
    _showNext(){
        $('#steps-controller [data-action="next"]').css('display','flex');
    },
    _hideNext(){
        $('#steps-controller [data-action="next"]').css('display','none');
    },
    _showBack(){
        $('#steps-controller [data-action="back"]').css('display','flex');
    },
    _hideBack(){
        $('#steps-controller [data-action="back"]').css('display','none');
    },
    _loadEscala(){

        var checkAltura=function(){
            var val=$(this).val();
            if(val!=0){
                visorFunctions.alturaReferencia=val;
            }
            if(val!=0 || app.newModelAssistant.escalaImageData!=null){
                newModelFunctions._showNext();
            }else{
                newModelFunctions._hideNext();
            }
        }

        $('#altura').unbind();
        $('#figura-completa').unbind();
        $('#altura').change(checkAltura);
        $('#figura-completa').mousedown(function(e){
            console.log('hola');
            app.newModelAssistant.seleccionEscala.arrastrando=true;
            app.newModelAssistant.seleccionEscala.origen.x=e.offsetX;
            app.newModelAssistant.seleccionEscala.origen.y=e.offsetY;
        }).mousemove(function(e){
            var ctx=app.newModelAssistant.context;
            ctx.putImageData(app.newModelAssistant.imageData,0,0);
            if(app.newModelAssistant.seleccionEscala.arrastrando){
                console.log('moviendo');
                var ctx=app.newModelAssistant.context;
                var x=e.offsetX;
                var y=e.offsetY;
                var xo=app.newModelAssistant.seleccionEscala.origen.x;
                var yo=app.newModelAssistant.seleccionEscala.origen.y;

                var w=Math.abs(xo-x);
                var h=Math.abs(yo-y);
                var origen={};
                origen.x=xo;
                if(x<xo){origen.x=x;}
                origen.y=yo;
                if(y<yo){origen.y=y;}
                
                app.newModelAssistant.seleccionEscala.dimension.w=w;
                app.newModelAssistant.seleccionEscala.dimension.h=h;
                ctx.strokeStyle="#FF0000";
                ctx.strokeRect(origen.x, origen.y, w, h);
            }
            
        }).mouseup(function(e){
            app.newModelAssistant.seleccionEscala.arrastrando=false;
            var x=e.offsetX;
            var y=e.offsetY;
            var xo=app.newModelAssistant.seleccionEscala.origen.x;
            var yo=app.newModelAssistant.seleccionEscala.origen.y;

            var origen={};
            origen.x=xo;
            if(x<xo){origen.x=x;}
            origen.y=yo;
            if(y<yo){origen.y=y;}
            
            var dimension=app.newModelAssistant.seleccionEscala.dimension;
            var ctx=app.newModelAssistant.context;
            var imData=ctx.getImageData(origen.x,origen.y,dimension.w,dimension.h);
            var canvas=document.getElementById('canvas-escala');
            canvas.style.width=dimension.w+'px';
            canvas.style.height=dimension.h+'px';
            canvas.width=dimension.w;
            canvas.height=dimension.h;
            var ctx2=canvas.getContext("2d");
            ctx2.putImageData(imData,0,0);
            app.newModelAssistant.escalaImageData=imData;
            var img=canvas.toDataURL('image/png');
            $('#img-muestra-escala').html('<img src="'+img+'" />');
            newModelFunctions._showNext();
        });
    },
    _next(){
        console.log(app.newModelAssistant.step);
        switch(app.newModelAssistant.step){
            case 0: 
                    newModelFunctions._showBack();
                    newModelFunctions._moverScroller(1);
                    newModelFunctions._seleccionarStep(1);
                    newModelFunctions._hideNext();
                    newModelFunctions._loadEscala();
                    break;

            case 1: if(visorFunctions.alturaReferencia!=null){
                        newModelFunctions._initSeleccionEje();
                        newModelFunctions._seleccionarStep(2);
                    }else{
                        var canvas=document.getElementById('canvas-escala');
                        var ctx=canvas.getContext('2d');
                        var imData=ctx.getImageData(0,0,canvas.width,canvas.height);
                        app.imageProccessor._umbralizar(imData,50);

                        ctx.putImageData(imData,0,0);
                        var imgBase64=document.getElementById('canvas-escala').toDataURL('image/png',1.0);
                        console.log(imgBase64);
                        var imagen={};
                        imagen['imagen']=imgBase64;
                        var datos={};
                        datos['datos']=JSON.stringify(imagen);
                        //app._getLoaderView('analizando escala');
                        Api._getObjectSize(datos).done(
                            data => {
                                $('#wrapper-loader').fadeOut(500);
                                var datos=data;
                                console.log(datos);
                                console.log(datos.ppcm);
                                visorFunctions.ppcm=datos.ppcm;
                                newModelFunctions._initSeleccionEje();
                                newModelFunctions._seleccionarStep(2);
                            }
                        )
                    }
                    break;
            case 2: app.imageProccessor._extraerBordes();
                    $('#new-model-process [data-type="boton"][data-action="finalizar"]').css('display','flex');
                    $('#new-model-process [data-type="boton"][data-action="next"]').fadeOut(250);
                    break;
        }
        app.newModelAssistant.step++;
    },
    _back(){
        switch(app.newModelAssistant.step){
            case 1: 
                    newModelFunctions._seleccionarStep(0);
                    newModelFunctions._hideBack();
                    newModelFunctions._moverScroller(0);
                    newModelFunctions._showNext();
                    break;

            case 2: newModelFunctions._seleccionarStep(1);
                    break;
        }
        app.newModelAssistant.step--;
    },
    _destroySeleccionEje(){
        $('#figura-completa').unbind();
    },
    _resetCanvas(){
        newModelFunctions._changeMessageCabecera('Cargar imagen');
        app.newModelAssistant.imageDataAnterior.pop();
        var imData=app.newModelAssistant.imageDataAnterior[app.newModelAssistant.imageDataAnterior.length-1];
        app.newModelAssistant.context.putImageData(imData,0,0);
    },
    _initCanvas(){
        app.newModelAssistant.canvas=document.getElementById('figura-completa');
        app.newModelAssistant.context=app.newModelAssistant.canvas.getContext('2d');
        app.newModelAssistant.imageDataAnterior=[];
        app.newModelAssistant.imageData=app.newModelAssistant.context.getImageData(0,0,app.newModelAssistant.canvas.width,app.newModelAssistant.canvas.height);
        app.newModelAssistant.imageDataAnterior.push(app.newModelAssistant.context.getImageData(0,0,app.newModelAssistant.canvas.width,app.newModelAssistant.canvas.height));
    },
    _borrarMitad(){
        var canvas=app.newModelAssistant.canvas;
        var ctx=app.newModelAssistant.context;
        var x=app.newModelAssistant.ejeX;
        var width=app.newModelAssistant.canvas.width;
        var widthRect=width-x;
        ctx.fillStyle="rgba(255,0,0,1)";
        ctx.fillRect(x,0,2,app.newModelAssistant.canvas.height);
        var imData=ctx.getImageData(0,0,x-1,app.newModelAssistant.canvas.height);
        var canvasR=document.getElementById('eje-simetria');
        var ctxR=canvasR.getContext('2d');
        canvasR.style.width=(x-1)+"px";
        canvasR.width=(x-1);
        canvasR.style.height=app.newModelAssistant.canvas.height+'px';
        canvasR.height=app.newModelAssistant.canvas.height;
        ctxR.putImageData(imData,0,0);

        app.newModelAssistant.imageData=ctxR.getImageData(0,0,canvasR.width,canvasR.height);

    },
    _seleccionarEje(){
        console.log('seleccion eje')
        newModelFunctions._borrarMitad();
        newModelFunctions._destroySeleccionEje();
    },
    _changeMessageCabecera(msg){
        $('#new-model-process .cabecera h2').html(msg);
    },
    _initSeleccionEje(){

        var pintarEje=function(e){
            var x=e.offsetX;
            app.newModelAssistant.ejeX=x;
            var ctx=app.newModelAssistant.context;
            
            ctx.putImageData(app.newModelAssistant.imageData,0,0);
            ctx.fillStyle="rgba(255,255,255,1)";
            ctx.fillRect(x,0,2,app.newModelAssistant.canvas.height);
        }
        var ctx=app.newModelAssistant.context;
        var imData=ctx.getImageData(0,0,app.newModelAssistant.canvas.width,app.newModelAssistant.canvas.height);
        ctx.putImageData(imData,0,0);

        app.newModelAssistant.imageDataAnterior.push(imData);
        $('#figura-completa').unbind();
        $('#figura-completa').mousemove(function(e){pintarEje(e);});
        $('#figura-completa').click(newModelFunctions._seleccionarEje)
    },
    analizarAccion(){
        var action=$(this).attr('data-action');
        switch(action){
            case "load-image": $('#input-imagen').click();break;
            case "close-popup":NewModelFunctions._reset();$('#popup').fadeOut(500);break;
            case "next":newModelFunctions._next(); break;
            case "finalizar":
                app._getVisorView(app.newModelAssistant.lienzo.paths[0].getPoints());
                app.newModelAssistant.lienzo.reset();
                newModelFunctions._reset();
                $('#popup').fadeOut(500); break;
                //app.gesNewModel._close();break;
            case "back":newModelFunctions._back();break;
        }
    },

    readImage(file){
        return new Promise(function(resolve,reject){
            var reader = new FileReader();

            reader.onload = function(e) {
                resolve(e.target.result);
            }

            reader.onerror = function(err){
                reject(err);
            }

            reader.readAsDataURL(file);
        });
        
    },
    attachToCanvas(src){
        var canvas = document.getElementById('figura-completa');
        var ctx = canvas.getContext("2d");
        var img = new Image();
        img.onload = function() {
            var prop=img.width/img.height;
            var alto=$('#cover-canvas .canvas-zone').height()-20;
            console.log(alto);
            if(img.height<alto){
                alto=img.height;
            }
            var ancho=alto*prop;
            canvas.style.height=alto+'px';
            canvas.style.width=ancho+'px';
            canvas.height = alto;
            canvas.width = ancho;
            
            $('#cover-canvas .canvas-zone').width(ancho);
            $('#cover-canvas .canvas-zone').height(alto);

            ctx.drawImage(this, 0, 0, this.width,this.height,0, 0, ctx.canvas.width, ctx.canvas.height);
            newModelFunctions._initCanvas();
        };
        img.src = src;
    },
    
    loadImagen(file){
        
        newModelFunctions.readImage(file).then(function(src){
            newModelFunctions.attachToCanvas(src);
        }).catch(function(err){
            console.log(err);
        });
        
    },

    changeSelectImage(){
        console.log('in-imagen');
        var files=$(this).prop('files');
        if(files.length>0){
            $('#imselect').html(files[0].name);
            $('#steps-controller [data-action="next"]').css('display','flex');
            newModelFunctions.loadImagen(files[0]);
        }
    }
}