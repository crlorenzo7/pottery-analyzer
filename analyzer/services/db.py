import pymongo

client = pymongo.MongoClient('ds151513.mlab.com', 51513)
db=client['pottery']
db.authenticate('admin','K19101motril;')

class DB:
    db=None

    def __init__(self):
        client = pymongo.MongoClient('ds151513.mlab.com', 51513)
        self.db=client['pottery']
        self.db.authenticate('admin','K19101motril;')
    
    def get_connection(self):
        return self.db
