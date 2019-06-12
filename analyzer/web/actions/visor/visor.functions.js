var visorFunctions={
    alturaReferencia:null,
    ppcm:null,
    figura:new Figure(),
    contenedor:null,
    _close:function(){
        $('#visor').animate({'left':'100%'},500,function(){
             app.visor._clear();
             visorFunctions._reset();
        });
    },
    _reset:function(){
        var figura=new Figure();
        visorFunctions.alturaReferencia=null;
        visorFunctions.ppcm=null;
        visorFunctions.figura=figura;
        
    },
    _setTitulo:function(titulo){
        visorFunctions.figura.titulo=titulo;
    }
}