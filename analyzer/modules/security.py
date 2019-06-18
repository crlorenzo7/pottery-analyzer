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

"""
genera un Json Web Token en el que se introduce la informacion del email del
usuario
"""
def generateJWT(email):
    
    return str(jwt.encode({'email': email,'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=604800)}, settings.SECRET_KEY, algorithm='HS256'))

"""
comprueba la valided de un token JWT de usuario
"""
def verificarJWT(token):
    try:
        res=jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        
        return res
    except:
        return None
    return None