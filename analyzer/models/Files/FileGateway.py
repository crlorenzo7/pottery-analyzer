from analyzer.models.Files.File import File

class FileGateway:
    
    db=None

    def __init__(self,db):
        self.db=db

    def insertFile(self,file):
        files=self.db.get_connection().files
        file_id = files.insert_one(file.toJSON()).inserted_id
        filePadre=files.update_one({'id':file.get_id_padre()},{'$inc':{'next':1}})
        if not (file_id is None):
            return True
        return False
    
    def listFiles(self,filters={}):
        files=self.db.get_connection().files
        list_files=list(files.find(filters,{'_id':0}))
        return list_files
    
    def getFile(self,id):
        files=self.db.get_connection().files
        file=files.find_one({'id':id},{'_id':0})
        return file
    
    def updateFile(self,id,file):
        files=self.db.get_connection().files
        updated_files=files.replace_one({'id':id},file.toJSON())
        if updated_files.matched_count==1:
            return True
        return False
    
    def updateFiles(self,filters={},properties={}):
        files=self.db.get_connection().files
        updated_files=files.update_many(filters,{'$set':properties})
        if updated_files.matched_count==1:
            return True
        return False
    
    def patchFile(self,id,patched_properties):
        files=self.db.get_connection().files
        updated_files=files.update_one({'id':id},{'$set':patched_properties})
        if updated_files.matched_count==1:
            return True
        return False
    
    def deleteFile(self,id):
        files=self.db.get_connection().files
        deleted_files=files.delete_one({'id':id})
        if deleted_files.deleted_count==1:
            return True
        return False
    
    def deleteFiles(self,filters):
        files=self.db.get_connection().files
        deleted_files=files.delete_many(filters)
        if deleted_files.deleted_count > 0:
            return True
        return False
    
    def exists(self,id):
        file=self.db.get_connection().files.find_one({'id':id})
        if file is None:
            return False
        return True