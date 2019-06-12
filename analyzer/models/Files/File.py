from analyzer.models.BaseModel import BaseModel
import time;

class File(BaseModel):
    """
    Clase que contiene los datos asociados a un elemento del sistema de archivos
    """
    def __init__(self,file=None):
        self.id=""
        self.tipo="carpeta"
        self.titulo=""
        self.fechaCreacion=int(time.time())
        self.idPadre=""
        self.idUsuario=""
        self.figura=None
        self.next=0
        if file is not None:
            self.loadFromDict(file)
    
    def get_id(self):
        """ obtener identificador de un archivo """
        return self.id

    def set_id(self,id):
        """ establecer identificador de un archivo """
        self.id=id
    
    def get_next(self):
        return self.next

    def set_next(self,next):
        self.next=next

    def get_titulo(self):
        """ obtener titulo de un archivo """
        return self.titulo

    def set_titulo(self,titulo):
        """ establecer titulo de un archivo """
        self.titulo=titulo
    
    def get_fecha_creacion(self):
        """ obtener fecha de creacion de un archivo """
        return self.fechaCreacion
    
    def set_fecha_creacion(self,fecha_creacion):
        """ establecer fecha de creacion de un archivo """
        self.fechaCreacion=fecha_creacion

    def get_id_padre(self):
        """ obtener identificador del archivo que lo contiene """
        return self.idPadre

    def set_id_padre(self,id_padre):
        """ establecer un archivo padre diferente """
        self.idPadre=id_padre
    
    def get_id_usuario(self):
        """ obtener identificador del usuario propietario un archivo """
        return self.idUsuario

    def set_id_usuario(self,id_usuario):
        """ establecer identificador del propietario de un archivo """
        self.idUsuario=id_usuario

    def get_figura(self):
        """ obtener figura de de un archivo """
        return self.figura
    
    def set_figura(self,figura):
        """ establecer figura de un archivo """
        self.figura=figura





