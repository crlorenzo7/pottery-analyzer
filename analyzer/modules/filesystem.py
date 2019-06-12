from analyzer.models.Files.File import File
from analyzer.models.Files.FileGateway import FileGateway

class Filesystem:
    db=None

    def __init__(self,db):
        self.db=db

    def create(self,nick):
        file=File()
        file.set_titulo("root")
        file.set_id_padre(None)
        file.set_id_usuario(nick)
        file.set_next(0)
        file.set_id(nick)

        return file

    def getNode(self,id):
        fileGW=FileGateway(self.db)
        file=fileGW.getFile(id)
        if file is not None:
            if file['tipo']=='carpeta':
                file['hijos']=fileGW.listFiles({'idPadre':id})
            return file
        return None
    
    def deleteNode(self,id):
        print(id)
        fileGW=FileGateway(self.db)
        file=fileGW.getFile(id)
        res=fileGW.deleteFile(id)
        if file['tipo']=='carpeta':
            fileGW.deleteFiles({'idPadre':id})
        if res:
            return True
        return False

    def getNumberOfModels(self,id):
        fileGW=FileGateway(self.db)
        numberOfFiles=len(list(fileGW.listFiles({'tipo':'modelo','idUsuario':id})))
        return numberOfFiles

    def move(self,idModel,idFolder):
        fileGW=FileGateway(self.db)
        folder=File(fileGW.getFile(idFolder))
        file=File(fileGW.getFile(idModel))

        idNew=idFolder+"_"+str(folder.get_next())
        next=folder.get_next()+1
        fileGW.patchFile(idFolder,{'next':next})
        fileGW.patchFile(idModel,{'idPadre':idFolder,'id':idNew})
        fileGW.updateFiles({'idPadre':idModel},{'idPadre':idNew})



