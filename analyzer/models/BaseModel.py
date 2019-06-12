import inspect
class BaseModel:

    def __init__(self):
        pass
    
    def toJSON(self):
        properties=vars(self)
        if '_id' in properties.keys():
            del properties['_id']
        for key,value in properties.items():
            if inspect.isclass(value):
                properties[key]=value.toJSON()

        return properties
    
    def getProperties(self):
        return list(vars(self).keys())

    def loadFromDict(self,object_dict):
        for key,val in object_dict.items():
                setattr(self, key, val)