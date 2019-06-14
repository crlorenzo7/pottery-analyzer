from  django.contrib.auth.hashers import make_password,check_password
from django.conf import settings
import jwt
import random
import datetime

def createPassword(pas):
    finalPass = make_password(pas)
    return finalPass

def verifyPassword(passw,encode):
    return check_password(passw,encode)


def generateJWT(email):
    
    return str(jwt.encode({'email': email,'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=604800)}, settings.SECRET_KEY, algorithm='HS256'))


def verificarJWT(token):
    try:
        res=jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        
        return res
    except:
        return None
    return None