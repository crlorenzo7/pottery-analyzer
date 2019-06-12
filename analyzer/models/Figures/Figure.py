from analyzer.models.BaseModel import BaseModel

class Figure(BaseModel):
    """
    Clase que contiene los datos de una figura 
    """
    def __init__(self,figure=None):
        self.altura=0.0
        self.diametro=0.0
        self.volumen=0.0
        self.capacidad=0.0
        self.imagen=""
        self.textura=""
        self.datos=[]
        if figure is not None:
            self.loadFromDict(figure)
    
    def get_altura(self):
        return self.altura
    
    def set_altura(self,altura):
        self.altura=altura
    
    def get_diametro(self):
        return self.diametro
    
    def set_diametro(self,diametro):
        self.diametro=diametro
    
    def get_capacidad(self):
        return self.capacidad

    def set_capacidad(self,capacidad):
        self.capacidad=capacidad
    
    def get_volumen(self):
        return self.volumen
    
    def set_volumen(self,volumen):
        self.volumen=volumen
    
    def get_imagen(self):
        return self.imagen
    
    def set_imagen(self,imagen):
        self.imagen=imagen
    
    def get_textura(self):
        return self.textura

    def set_textura(self,textura):
        self.textura=textura
    
    def set_datos(self,datos):
        self.datos=datos
    
    def get_datos(self):
        return self.datos

    def add_dato(self,dato):
        self.datos.append(dato)
    
    def remove_dato(self,index):
        del self.datos[index]

    

