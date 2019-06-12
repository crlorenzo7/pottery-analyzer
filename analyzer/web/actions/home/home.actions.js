function homeActions(){
    $('#menu-home li').unbind();
    $('#menu-home li').click(function(){
        if($(this).attr('data-estado')=='inactivo'){
            selectMenu(this);
        }
    });
    $('.modelo').unbind();
    $('#controls-bar .boton').unbind();
    $('.path-step').unbind();
    $('.folder').unbind();
    $('.folder .titulo').unbind();
    $('.modelo .titulo').unbind();
    $('#context-menu .item').unbind();
    $('.modelo').contextmenu(function(e){homeFunctions.showContextMenu(e,this)});
    $('.modelo[data-estado="inactivo"]').mouseenter(homeFunctions.showModelOptions);
    $('.modelo[data-estado="inactivo"]').mouseleave(homeFunctions.hideModelOptions);
    $('.modelo').click(homeFunctions.selectModel);
    $('.modelo').on('dragstart',function(e){
        homeFunctions.draggingObject=$(this);
        e.originalEvent.dataTransfer.setData('modelo',JSON.stringify({tipo:'modelo',id:$(this).attr('data-id')}))
    });
    $('#context-menu .item').click(homeFunctions.analizarAccion);
    $('#controls-bar .boton').click(homeFunctions.analizarAccion);
    $('.folder').dblclick(homeFunctions.abrirCarpeta);
    $('.folder').contextmenu(function(e){homeFunctions.showContextMenu(e,this)});
    $('.folder').on('dragstart',function(e){
        homeFunctions.draggingObject=$(this);
        e.originalEvent.dataTransfer.setData('modelo',JSON.stringify({tipo:'folder',id:$(this).attr('data-folder')}))
    });
    $('.folder').on('dragover',function(e){
        e.preventDefault();
    })
    $('.folder').on('drop',function(e){
        e.preventDefault();  
        var datosModelo=JSON.parse(e.originalEvent.dataTransfer.getData('modelo'));
        var idFolder=$(this).attr('data-folder');
        if(datosModelo.id!=idFolder){
            app.filesystem.moveToFolder(datosModelo.id,idFolder);
            $(homeFunctions.draggingObject).remove();
            homeFunctions.draggingObject=null;
            app._getModelos();
            Api._moveFile({idModel:datosModelo.id,idFolder:idFolder}).done(function(data){

            })
            
        }
        
    });
    $('.folder .titulo').click(function(){
        $(this).attr('contenteditable','true');
        $(this).focus();
        homeFunctions.changeTitle=$(this).html().trim();
    });
    $('.modelo .titulo').focusin(function(){
        homeFunctions.changeTitle=$(this).html().trim();
        
    });
    $('.modelo .titulo').focusout(function(){
        homeFunctions.changeModelTitle(this);
        
    });

    $('.modelo .titulo').keypress(function(e){
        if(e.which==13){
            e.preventDefault();
            homeFunctions.changeModelTitle(this);
            $(this).focusout();
        }
    });
    $('.folder .titulo').focusout(function(){
        homeFunctions.changeFolderTitle(this);
        $(this).attr('contenteditable','false');
    });

    $('.folder .titulo').keypress(function(e){
        if(e.which==13){
            e.preventDefault();
            homeFunctions.changeFolderTitle(this);
            $(this).attr('contenteditable','false');
        }
    });
    $('.path-step').click(homeFunctions.abrirCarpetaDesdeCabecera);
    $('.path-step').on('dragover',function(e){
        e.preventDefault();
    })
    $('.path-step').on('drop',function(e){
        e.preventDefault();  
        var datosModelo=JSON.parse(e.originalEvent.dataTransfer.getData('modelo'));
        var idFolder=$(this).attr('data-action');
        console.log('id_folder: '+ idFolder)
        if(idFolder!='no'){
            
            app.filesystem.moveToPath(datosModelo.id,idFolder);
            if(idFolder=='root'){
                idFolder=app.filesystem.user_nick;
            }
            $(homeFunctions.draggingObject).remove();
            homeFunctions.draggingObject=null;
            app._getModelos();
            Api._moveFile({idModel:datosModelo.id,idFolder:idFolder}).done(function(data){

            })
            
        }
        
    });
}
