
function globalActions(){
    
    var closeContextMenu=function(){
        if($('#context-menu').length>0){
            $('#context-menu').fadeOut(150,function(){$(this).remove();});
        }
    }
    $('html').click(function(e){
        closeContextMenu(); 

        if($(e.target).parents('#banner-new-folder').length==0 && $('#wrapper-banner').is(':visible')){
            console.log($(this).parents('#banner-new-folder').length)
            console.log($('#wrapper-banner').is(':visible'));
            $('#wrapper-banner').fadeOut(500);
        }
    });
    
}