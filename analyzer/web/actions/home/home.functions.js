var homeFunctions={
    modelosSeleccionados:[],
    changeTitle:"",
    draggingObject:null,

    _reset(){
        homeFunctions.modelosSeleccionados=[];
        homeFunctions._checkControlButtons();
    },
    _checkControlButtons(){
        var nSeleccionados=homeFunctions.modelosSeleccionados.length;
        switch(nSeleccionados){
            case 0: $('#controls-bar .boton[data-type!="fixed"]').attr('data-estado','inactivo'); break;
            case 1: $('#controls-bar .boton[data-type!="fixed"]').attr('data-estado','activo');break;
            default: $('#controls-bar .boton[data-type!="fixed"]').attr('data-estado','activo');
                     $('#controls-bar .boton[data-action="open"]').attr('data-estado','inactivo');
                     break;
        }
        
    },
    
    selectMenu(item){
        $(item).siblings().attr('data-estado','inactivo');
        $(item).attr('data-estado','activo');
    },

    showContextMenu(event,item){
        if($('#context-menu').length>0){
            $('#context-menu').fadeOut(150,function(){
                $(this).remove();
                app._getContextMenu(event,item);
            });
        }else{
            app._getContextMenu(event,item);
        }
        
    },

    showModelOptions(){
        var estado=$(this).attr('data-estado');
        if(estado=='inactivo'){
            $(this).find('.cover').fadeIn(250);
        }
    },
    hideModelOptions(){
        var estado=$(this).attr('data-estado');
        if(estado=='inactivo'){
            $(this).find('.cover').fadeOut(250);
        }
    },

    

    selectModel(){
        var estado=$(this).attr('data-estado');
        var id=$(this).attr('data-id');
        if(estado=='inactivo'){
            homeFunctions.modelosSeleccionados.push(id);
            $(this).attr('data-estado','activo');
        }else{
            homeFunctions.modelosSeleccionados.splice(homeFunctions.modelosSeleccionados.indexOf(id),1);
            $(this).attr('data-estado','inactivo');
        }
        homeFunctions._checkControlButtons();
        console.log(homeFunctions.modelosSeleccionados);
    },

    borrarSeleccion(){
        homeFunctions.modelosSeleccionados=[];
        $('.modelo').attr('data-estado','inactivo');
        homeFunctions._checkControlButtons();
    },

    abrirModelo(id=null){
        if(id==null){
            id=homeFunctions.modelosSeleccionados[0];
        }
        var modelo=app.filesystem.getFileById(id);
        app._getVisorFromManager(modelo);
        console.log(modelo);
    },
    borrarModelos(id=null){
        var arrModel=homeFunctions.modelosSeleccionados;
        if(id!=null){
            arrModel=[id];
        }

        Api._deleteFiles(arrModel).done(
            data =>{
                for(var i=0;i<arrModel.length;i++){
                    app.filesystem.deleteFile(arrModel[i]);
                    $('.modelo[data-id="'+arrModel[i]+'"]').remove();
                }
            }
        ).fail(
            err => console.log(err)
        )
        
    },

    descargarModelo(id){
        var modelo=app.filesystem.getFileById(id);
        var titulo=modelo.titulo;
        var image = modelo.figura.imagen;
        console.log(image);
        homeFunctions.saveImage(image.replace('image/png', 'image/octet-stream'), titulo+".png");
        
    },

    saveImage(url,name){
        var link = document.createElement('a');
        
        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = name;
        link.href = url;
        link.click();
        document.body.removeChild(link); //remove the link when done
        
    },

    exportarModelo(id=null){
        var arrModel=homeFunctions.modelosSeleccionados;
        if(id!=null){
            arrModel=[id];
        }

        var csvContent='data:text/csv;charset=utf-8,id;titulo;altura (cm);anchura (cm);volumen_de_tierra (cc);capacidad (cc)\r\n';
        for(var i=0;i<arrModel.length;i++){
            var model=app.filesystem.getFileById(arrModel[i]);
            csvContent+=model.id+';'+model.titulo+';'+model.figura.altura+';'+model.figura.anchura+';'+model.figura.volumen+';'+model.figura.capacidad+'\r\n';
        }
        var encodeUrl=encodeURI(csvContent);
        var link = document.createElement('a');
        
            //Firefox requires the link to be in the body
        link.download = 'modelos.csv';
        link.href = encodeUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 
    },

    getBannerNewFolder(){
        var saveFolder=function(nombre_carpeta){
            var file=new PotteryFile();
            file.id=app.filesystem.getCurrentNode().id+'_'+app.filesystem.getCurrentNode().next;
            file.figura=null;
            file.titulo=nombre_carpeta;
            file.type='carpeta';
            file.idPadre=app.filesystem.getCurrentNode().id;
            file.next=0;
            file.idUsuario=app.filesystem.user_nick;
            app.filesystem.addFile(file);
            $('#wrapper-banner').fadeOut(500);
            app._getModelos();
            Api._saveFile(file).done(data => {console.log(data);})
        }

        var analizarBotonBanner=function(){
            var action=$(this).attr('data-action');
            if(action=='cancelar'){
                $('#wrapper-banner').fadeOut(500);
            }
            if(action=='aceptar'){
                var nombre_carpeta=$('#new-folder-input').val();
                if(nombre_carpeta!=''){
                    saveFolder(nombre_carpeta);
                }
            }
        }

        var cb=function(){
            $('#banner-new-folder .boton').unbind();
            $('#banner-new-folder .boton').click(analizarBotonBanner)

            $('#new-folder-input').unbind();
            $('#new-folder-input').keypress(function(e){
                if(e.which==13){
                    var nombre_carpeta=$(this).val();
                    saveFolder(nombre_carpeta);
                }
            })
        }

        app._getBannerView('new-folder.ejs',cb);
    },

    abrirCarpeta(){
        var id=$(this).attr('data-folder');
        app.filesystem.openFolder(id);
        if(typeof app.filesystem.getCurrentNode().hijos != 'undefined'){
            app._getModelos();
        }else{
            Api._getFile(id).done(function(data){
                app.filesystem.update(data.file);
                app._getModelos();
            })
        }
        /*var orden=parseInt($(this).attr('data-orden'));
        if(id in app.fileSystem){
            nodo=app.fileSystem[id];
            app.nodoActual=nodo;
            app._getModelos();
        }else{
            PAPI._getItemsFolder(id).done(function(data){
                console.log(data);
                var nodo=app.nodoActual.folders[orden]
                nodo.folders=data.folder.folders;
                nodo.modelos=data.folder.modelos;
                nodo.total_items=data.folder.total_items;
                console.log(nodo);
                app.nodoActual=nodo
                app.fileSystem[nodo.id]=nodo;
                
                
                app._getModelos();
            }).fail(function(err){console.log(err);})
        }*/
    },

    abrirCarpetaDesdeCabecera(){
        var action=$(this).attr('data-action');
        if(action!='no'){
            app.filesystem.openFromRoute(action);
            app._getModelos();
        }
    },

    deleteFolder(id){
        app.filesystem.deleteFile(id);
        app._getModelos();
        Api._deleteFile(id).done(function(data){
            app._getModelos();
        });
    },

    analizarAccion(){
        var action=$(this).attr('data-action');
        switch(action){
            case 'new': app._getNewModelView() ;break;
            case 'new-folder':homeFunctions.getBannerNewFolder();break;
            case 'clear': homeFunctions.borrarSeleccion() ;break;
            case 'delete': 
                if($(this).hasClass('item')){
                    homeFunctions.modelosSeleccionados=[];
                    $('.modelo').attr('data-estado','inactivo');
                    homeFunctions.borrarModelos($(this).parents('#context-menu').attr('data-idmodel'));
                }else{
                    homeFunctions.borrarModelos();
                };
                break;
            case 'delete-folder':
                var idFolder=$(this).parents('#context-menu').attr('data-idmodel');
                homeFunctions.deleteFolder(idFolder);
                break;
            case 'open': 
                if($(this).hasClass('item')){
                    homeFunctions.modelosSeleccionados=[];
                    $('.modelo').attr('data-estado','inactivo');
                    homeFunctions.abrirModelo($(this).parents('#context-menu').attr('data-idmodel'));
                }else{
                    homeFunctions.abrirModelo();
                };break;
            case 'export': 
                if($(this).hasClass('item')){
                    homeFunctions.modelosSeleccionados=[];
                    $('.modelo').attr('data-estado','inactivo');
                    homeFunctions.exportarModelo($(this).parents('#context-menu').attr('data-idmodel'));
                }else{
                    homeFunctions.exportarModelo();
                };break;
            case 'download': homeFunctions.descargarModelo($(this).parents('#context-menu').attr('data-idmodel')); break;
        }
    },

    changeFolderTitle(item){
        var valor=$(item).html().trim();
        if(valor!=''){
            var idFolder=$(item).parents('.folder').attr('data-folder');
            app.filesystem.changeTitle(valor,idFolder);
            datos={titulo:valor};
            Api._pathFile(idFolder,datos).done(function(data){
                console.log(data);
            }).fail(function(err){console.log(err);})
        }else{
            $(item).html(changeTitle);
        }
    },

    changeModelTitle(item){
        var valor=$(item).html().trim();
        if(valor!=''){
            var idModel=$(item).parents('.modelo').attr('data-id');
            app.filesystem.changeTitle(valor,idModel);
            datos={titulo:valor};
            Api._pathFile(idModel,datos).done(function(data){
                console.log(data);
            }).fail(function(err){console.log(err);})
        }else{
            if(changeTitle!=''){
                s$(item).html(changeTitle);
            }
        }
    }
}