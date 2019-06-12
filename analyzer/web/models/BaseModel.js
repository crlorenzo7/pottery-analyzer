class BaseModel{

    constructor(){}

    toJson(){
        var json={}
        var properties=Object.keys(this);
        for(var i=0;i<properties.length;i++){
            if(this[properties[i]] instanceof Figure){
                json[properties[i]]=this[properties[i]].toJson();
            }else{
                json[properties[i]]=this[properties[i]];
            }
        }
        return json;
    }
    
    getProperties(){
        return Object.keys(this);
    }
    
    fromJson(json){
        for(var key in json){
            this[key]=json[key];
        }
    }
}