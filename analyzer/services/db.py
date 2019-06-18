import pymongo
from django.conf import settings

client = pymongo.MongoClient(settings.DB_SETTINGS['host'], settings.DB_SETTINGS['port'])
db=client[settings.DB_SETTINGS['client']]
db.authenticate(settings.DB_SETTINGS['user'],settings.DB_SETTINGS['password'])

class DB:
    #db=None

    def __init__(self):
        pass
        
    
    def get_connection(self):
        return db
