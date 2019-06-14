console.log('hola');
window.oncontextmenu = function ()
{
    return false;     // cancel default menu
}

class AnalyzedData{
    w=null;
    h=null;
    diff=null;
    constructor(w,h,diff){
        this.w=w;
        this.h=h;
        this.diff=diff;
    }
}

class App{
    filesystem=null;
    user=null;
    newModelAssistant=null;
    analyzedData=null;
    visor=null;
    imageProccessor=null;
    constructor(){
        this.imageProccessor=new ImageProccessor();
    }

    login(user_data){
        self=this;
        Access.login(user_data).then(function(data){
            self.user=new User(data.user);
            localStorage.setItem("token",data.token);

            self.filesystem=new Filesystem(self.user.nick,data.root,data.totalModelos);
            self._getHomeView();

        }).catch(function(err){
            if(err.status==401){
                alert('usuario o contraseña incorrectos');
            }
        })
    }

    signup(user_data){
        self=this;
        Access.signup(user_data).then(function(data){
            self.user=new User(data.user);
            localStorage.setItem("token",data.token);

            self.filesystem=new Filesystem(self.user.nick,data.root,data.totalModelos);
            self._getHomeView();
        }).catch(function(err){
            console.log(err);
        })
    }

    _getIndexView(){
        Utils.templates.loadTemplate('static/views/landing.ejs','content',{menu:MENU_APP}).then(
            data => actions.load()
        )
    }

    _getLoginView(){
        var seccion={}
        seccion.nombre='login';    
        seccion.titulo='Iniciar Sesion';
        seccion.form=LOGIN_FORM;

        Utils.templates.loadTemplate('static/views/login-registro.ejs','content',{seccion:seccion}).then(function(res){
            actions.load();
        });
    }

    _getSignupView(){
        var seccion={}
        seccion.nombre='registro';    
        seccion.titulo='Crea tu Cuenta';
        seccion.form=SIGNUP_FORM;

        Utils.templates.loadTemplate('static/views/login-registro.ejs','content',{seccion:seccion}).then(function(res){
            actions.load();
        });
    }

    _getHomeView(){
        Utils.templates.loadTemplate('static/views/home.ejs','content',{user:this.user.toJson(),modelos:this.filesystem.getSons(),ruta:this.filesystem.getPath()}).then(
            data => actions.load()
        )
    }

    _getBannerView(template,cb){
        Utils.templates.loadTemplate('static/views/banner/'+template,'wrapper-banner').then(function(data){
            $('#wrapper-banner').fadeIn(500);
            if(cb!=null){
                cb();
            }
            actions.load();
        })
    }

    _getNewModelView(){
        Utils.templates.loadTemplate('static/views/popup/loading.ejs','popup').then(
            data => { 
                actions.load();
                this.newModelAssistant=new NewModelAssistant();
                $('#popup').fadeIn(500);
            }
        )
    }

    _getModelos(){
        var ruta=app.filesystem.getPath();
        Utils.templates.loadTemplate('static/views/home/mis-modelos.ejs','wrapper-home',{modelos:app.filesystem.getCurrentNode().hijos,ruta:ruta}).then(
            data => {actions.load();}
        )
    }

    _getContextMenu(event,item){
        var cmenu=document.createElement('div');
        cmenu.setAttribute('id','context-menu');
        var t='modelo';
        var idm=$(item).attr('data-id');
        if($(item).hasClass('folder')){
            t='folder';
            idm=$(item).attr('data-folder');
        }
        cmenu.setAttribute('data-idmodel',idm); 
        $('body').append(cmenu);
        Utils._placeContextMenu(event,'context-menu');
        Utils.templates.loadTemplate('static/views/home/context-menu.ejs','context-menu',{tipo:t}).then(
            data => {
                $('#context-menu').css('display','block');
                var h=140;
                if(t=='folder'){
                    h=35;
                }
                $('#context-menu').animate({'width':200+'px','height':h+'px','opacity':1},150); 
                actions.load(); 
            }
        )
    }

    _getLoaderView(mensaje){
        Utils.templates.loadTemplate('static/views/utils/loader.ejs','wrapper-loader',{mensaje:mensaje}).then(
            data =>{actions.load();$('#wrapper-loader').fadeIn(500);}
        ).catch(function(err){ console.log(err)});
    }

    _getVisorFromManager(modelo){
       
        Utils.templates.loadTemplate('static/views/visor.ejs','visor',{titulo:modelo.titulo,id:modelo.id}).then(
            data => {
                visorFunctions.contenedor='vcanvas';
                visorFunctions.figura=modelo.figura;
                this.visor=new View3D();
                this.visor.init();
                actions.load();
                $('#visor').animate({'left':'0%'},500);
            }
        )
        
    }

    _getVisorView(datosFigura){
        visorFunctions.figura.titulo="nuevo-modelo";
        Utils.templates.loadTemplate('static/views/visor.ejs','visor',{titulo:visorFunctions.figura.titulo}).then(
            data => {
                visorFunctions.contenedor='vcanvas';
                var datos=[];
                for(var i=0;i<datosFigura.length;i++){
                    datos.push([(app.analyzedData.w-datosFigura[i].getX())+1,app.analyzedData.h-(datosFigura[i].getY()+app.analyzedData.diff),0]);
                }
                
                visorFunctions.figura.datos=datos;
                this.visor=new View3D();
                this.visor.init();
                actions.load();
                $('#visor').animate({'left':'0%'},500);
            }
        )
    }

    setAnalyzedData(w,h,diff){
        this.analyzedData=new AnalyzedData(w,h,diff);
    }
    
}

var app=null;

$(document).ready(function(){
    window.setTimeout(function(){
        app=new App();
        app._getIndexView();
    },2000);
})



