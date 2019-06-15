class Filesystem{
    tree=null;
    current_node=null;
    user_nick=null;
    total_modelos=0;

    constructor(nick,tree_root,total_modelos){
        this.user_nick=nick;
        this.tree=tree_root;
        this.current_node=tree_root;
        this.total_modelos=total_modelos;
    }

    getCurrentNode(){
        return this.current_node;
    }

    setCurrentNode(node){
        this.history.push(this.current_node);
        this.current_node=node;
    }

    getTotalModelos(){
        return this.total_modelos;
    }

    addModelo(){
        this.total_modelos++;
    }

    addFile(file){
        this.current_node.hijos.push(file.toJson());
        if(file.tipo=='modelo'){
            this.addModelo();
        }
        this.current_node.next++;
    }

    deleteFile(id){
        var found=this.current_node.hijos.findIndex((item)=>{ return item.id==id});
        if(this.current_node.hijos[found].tipo=='modelo'){
            this.deleteModelo();
        }
        this.current_node.hijos.splice(found,1);
    }

    deleteModelo(){
        this.total_modelos--;
    }

    getSons(){
        return this.current_node.hijos;
    }

    getFolders(){
        return this.current_node.hijos.filter(file => file.tipo=='carpeta');
    }

    getModels(){
        return this.current_node.hijos.filter(file => file.tipo=='modelo');
    }

    getPath(){
        var ruta='<span data-action="root" class="path-step">Mis Modelos</span>';
        var nodo=this.current_node;
        var rutasT=[];
        var padres=nodo.id.split('_');
        if(padres.length>1){
            var nodoPadre=this.tree;
            var id=this.tree.id;
            for(var i=1;i<padres.length;i++){
                id=id+'_'+padres[i];
                console.log(id);
                var sonIndex=this.getFileIndex(nodoPadre,id);
                var path_piece={
                    id:nodoPadre.hijos[sonIndex].id,
                    titulo:nodoPadre.hijos[sonIndex].titulo
                }
                rutasT.push(path_piece);
                if(i<padres.length-1){
                    nodoPadre=nodoPadre.hijos[sonIndex]
                }
            }
        }
        for(var i=0;i<rutasT.length;i++){
            if(i==rutasT.length-1){
                ruta+='<span class="separator"> > </span> <span data-action="no" class="path-step">'+rutasT[i].titulo+'</span>';
            }else{
                ruta+='<span class="separator"> > </span> <span data-action="'+rutasT[i].id+'" class="path-step">'+rutasT[i].titulo+'</span>';
            }
        }
        console.log(ruta);
        return ruta;
    }

    openFolder(id){
        var found=this.current_node.hijos.findIndex((item)=>{ return item.id==id});
        this.current_node=this.current_node.hijos[found];
        console.log(this.current_node);
    }

    openFromRoute(id){
        var niveles=id.split('_');

        if(id=='root'){
            this.current_node=this.tree;
        }else{
            var parcialId=this.user_nick;
            var nodoInicial=this.tree;
            for(var i=1;i<niveles.length;i++){
                parcialId=parcialId+'_'+niveles[i];
                console.log(parcialId);
                var index=this.getFileIndex(nodoInicial,parcialId);
                nodoInicial=nodoInicial.hijos[index];
            }
            this.current_node=nodoInicial;
        }
        
    }

    moveToFolder(idm,idf){
        var indexFolder=this.getFileIndex(this.current_node,idf);
        var indexModel=this.getFileIndex(this.current_node,idm);

        var folderNode=this.current_node.hijos[indexFolder];
        var modelNode=this.current_node.hijos[indexModel];
        
        modelNode.idPadre=folderNode.id;
        modelNode.id=folderNode.id+'_'+folderNode.next;
        console.log(folderNode);
        if(typeof folderNode.hijos != 'undefined'){
            folderNode.hijos.push(modelNode);
        }
        folderNode.next++;
        this.current_node.hijos.splice(indexModel,1);

    }

    moveToPath(idm,idf){
        var indexModel=this.getFileIndex(this.current_node,idm);
        var modelNode=this.current_node.hijos[indexModel];

        var niveles=idf.split('_');
        var folderNode=null;
        if(idf=='root'){
            folderNode=this.tree;
        }else{
            var parcialId=this.user_nick;
            var nodoInicial=this.tree;
            for(var i=1;i<niveles.length;i++){
                parcialId=parcialId+'_'+niveles[i];
                console.log(parcialId);
                var index=this.getFileIndex(nodoInicial,parcialId);
                nodoInicial=nodoInicial.hijos[index];
            }
            folderNode=nodoInicial;
        }
        
        modelNode.idPadre=folderNode.id;
        modelNode.id=folderNode.id+'_'+folderNode.next;
        console.log(folderNode);
        if(typeof folderNode.hijos != 'undefined'){
            folderNode.hijos.push(modelNode);
        }
        folderNode.next++;
        this.current_node.hijos.splice(indexModel,1);

    }

    getFileIndex(nodo,id){
        var found=nodo.hijos.findIndex((item)=>{ return item.id==id});
        return found;
    }

    getFileById(id){
        var index=this.getFileIndex(this.current_node,id);
        return this.current_node.hijos[index];
    }

    update(file){
        this.current_node.hijos=file.hijos;
        console.log(this.tree);
    }

    updateFile(file){
        var index=this.getFileIndex(this.current_node,file.id);
        this.current_node.hijos[index]=file.toJson();
    }

    changeTitle(valor,id){
        var index=this.getFileIndex(this.current_node,id);
        this.current_node.hijos[index].titulo=valor;
    }
}