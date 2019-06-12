class Access{
    constructor(){
    }

    static login(user_data){
        return new Promise(function(resolve,reject){
            Api._login(user_data).done(function(data){
                resolve(data);
            }).fail(err=>reject(err));
        });
    }

    static signup(user_data){
        return new Promise(function(resolve,reject){
            Api._signup(user_data).done(function(data){
                resolve(data);
            }).fail(err=>reject(err));
        });
    }
}