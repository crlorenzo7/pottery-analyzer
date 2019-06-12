class DB{
    constructor(){}

    static isLogged(){
        if(localStorage.getItem('token')!=null){
            return true;
        }else{
            return false;
        }
    }

    static getToken(){
        return localStorage.getItem('token');
    }

    static setToken(token){
        localStorage.setItem('token',token);
    }
}