from analyzer.models.BaseModel import BaseModel
import time;

class User(BaseModel):

    def __init__(self,user=None):
        self.nick=""
        self.email=""
        self.password=""
        self.fechaAlta=int(time.time())
        if user is not None:
            self.loadFromDict(user)

    def get_nick(self):
        return self.nick
    
    def set_nick(self,nick):
        self.nick=nick
    
    def get_email(self):
        return self.email
    
    def set_email(self,email):
        self.email=email

    def get_password(self):
        return self.password
    
    def set_password(self,password):
        self.password=password

    def get_fecha_alta(self):
        return self.fecha_alta
    
    def set_fecha_alta(self,fecha_alta):
        self.fecha_alta=fecha_alta