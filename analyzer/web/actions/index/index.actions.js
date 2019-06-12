function indexActions(){
    
        $('#login-form').unbind();
        $('#signup-form').unbind();
        $('#atras-button').unbind();
        $('#menu-principal li[data-estado="inactivo"]').unbind();
        $('#botones-inicio > .boton').unbind();

        $('#login-form').submit(function(e){e.preventDefault();indexFunctions.sendLoginForm(this);});
        $('#signup-form').submit(function(e){e.preventDefault();indexFunctions.sendSignupForm(this)});
        $('#atras-button').click(function(){app._getIndexView();});
        $('#menu-principal li[data-estado="inactivo"]').click(function(){
            alert('hola');
        });
        $('#botones-inicio > .boton').click(function(){
            var action=$(this).attr('data-action');
            if(action=='login'){
                app._getLoginView();
            }else{
                app._getSignupView();
            }
            
        });
    
}