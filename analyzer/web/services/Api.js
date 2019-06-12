class Api{
    constructor(){}

    static _login(datos){
        return Utils.http.ajaxRequest(config.server+'login/','POST',datos);
    }

    static _signup(datos){
        return Utils.http.ajaxRequest(config.server+'signup/','POST',datos);
    }

    static _saveFile(file){
        return Utils.http.ajaxRequest(config.server+'files/','POST',{file:JSON.stringify(file.toJson())});
    }

    static _deleteFile(id){
        return Utils.http.ajaxRequest(config.server+'files/'+id,'DELETE');
    }

    static _deleteFiles(datos){
        return Utils.http.ajaxRequestJSON(config.server+'files/','DELETE',{files:datos})
    }

    static _getFile(id){
        return Utils.http.ajaxRequest(config.server+'files/'+id,'GET');
    }

    static _pathFile(id,patched_properties){
        return Utils.http.ajaxRequestJSON(config.server+'files/'+id+'/','PATCH',patched_properties);
    }

    static _updateFile(id,file){
        return Utils.http.ajaxRequestJSON(config.server+'files/'+id+'/','POST',{file:JSON.stringify(file.toJson())});
    }

    static _moveFile(datos){
        return Utils.http.ajaxRequest(config.server+'files/move/','POST',{datos:JSON.stringify(datos)});
    }

    static _analizar(datos){
        return Utils.http.ajaxRequest(config.server+'images/analyze/','POST',datos);
    }

    static _getObjectSize(datos){
        return Utils.http.ajaxRequest(config.server+'images/size/','POST',datos);
    }
}