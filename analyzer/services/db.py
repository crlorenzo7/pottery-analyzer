import pymongo
from django.conf import settings

client = pymongo.MongoClient(settings.DB_SETTINGS['host'], settings.DB_SETTINGS['port'])
db=client[settings.DB_SETTINGS['client']]
db.authenticate(settings.DB_SETTINGS['user'],settings.DB_SETTINGS['password'])

class DB:
    #db=None

    def __init__(self):
        pass
        """client = pymongo.MongoClient('ds151513.mlab.com', 51513)
        self.db=client['pottery']
        self.db.authenticate('admin','K19101motril;')"""
    
    def get_connection(self):
        return db
