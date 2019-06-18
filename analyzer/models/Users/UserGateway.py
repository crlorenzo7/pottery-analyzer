from analyzer.models.Users.User import User

"""
clase que encapsula las operaciones relativas a la base de datos
que involucran a la entidad User
"""

class UserGateway:
    
    db=None

    def __init__(self,db):
        self.db=db

    def insertUser(self,user):
        users=self.db.get_connection().users
        user_id = users.insert_one(user.toJSON()).inserted_id

        if not (user_id is None):
            return True
        return False
    
    def listUsers(self):
        users=self.db.get_connection().users
        list_users=list(users.find({},{'_id':0,'password':0}))
        return list_users
    
    def getUser(self,id):
        users=self.db.get_connection().users
        user=users.find_one({'nick':id},{'_id':0})
        return user
    
    def updateUser(self,id,user):
        users=self.db.get_connection().users
        updated_users=users.replace_one({'nick':id},user.toJSON())
        if updated_users.matched_count==1:
            return True
        return False
    
    def patchUser(self,id,patched_properties):
        users=self.db.get_connection().users
        updated_files=users.update_one({'id':id},{'$set':patched_properties})
        if updated_files.matched_count==1:
            return True
        return False
    
    def deleteUser(self,id):
        users=self.db.get_connection().users
        deleted_users=users.delete_one({'nick':id})
        if deleted_users.deleted_count==1:
            return True
        return False
    
    def exists(self,nick):
        user=self.db.get_connection().users.find_one({'nick':nick})
        if user is None:
            return False
        return True