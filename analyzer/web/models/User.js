class User extends BaseModel{
    nick="";
    email=""
    fechaAlta=new Date().getTime();

    constructor(userJson=null){
        super();
        if(userJson!=null){
            this.fromJson(userJson);
        }
    }

    getNick(){
        return this.nick;
    }
    setNick(nick){
        this.nick=nick;
    }
    getEmail(){
        return this.email;
    }
    setEmail(email){
        this.email=email;
    }
    getFechaAlta(){
        return this.fechaAlta;
    }
    setFechaAlta(fechaAlta){
        this.fechaAlta=fechaAlta;
    }
}