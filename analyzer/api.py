from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse, HttpResponseNotFound
from analyzer.services.db import DB
from analyzer.modules import img_analyze
from analyzer.modules.filesystem import Filesystem
import json
from analyzer.models.Users.User import User
from analyzer.models.Users.UserGateway import UserGateway
from analyzer.models.Files.File import File
from analyzer.models.Files.FileGateway import FileGateway
from analyzer.modules import security

database=DB()
# Create your views here.

@csrf_exempt
def manage_http_users(request):
    if request.method=='GET':
        pass
    if request.method=='POST':
        pass
    return JsonResponse({},status=404,safe=False)

@csrf_exempt
def manage_http_users_id(request,id):
    if request.method=='GET':
        return getUser(request,id)
    if request.method=='POST':
        return updateUser(request,id)
    if request.method=='PATCH':
        return patchUser(request,id)
    if request.method=='DELETE':
        return deleteUser(request,id)
    return JsonResponse({},status=404,safe=False)

@csrf_exempt
def manage_http_images(request,action):
    if request.method=='POST':
        if action=='analyze':
            return get_profile_object(request)
        if action=='size':
            return get_size_object(request)
    return JsonResponse({},status=404,safe=False)

@csrf_exempt
def manage_http_files(request):
    if request.method=='GET':
        return listFiles(request)
    if request.method=='POST':
        return insertFile(request)
    if request.method=='DELETE':
        return deleteFiles(request)
    return JsonResponse({},status=404,safe=False)

@csrf_exempt
def manage_http_files_id(request,id):
    if request.method=='GET':
        return getFile(request,id)
    if request.method=='POST':
        return updateFile(request,id)
    if request.method=='PATCH':
        return patchFile(request,id)
    if request.method=='DELETE':
        return deleteFile(request,id)
    return JsonResponse({},status=404,safe=False)

@csrf_exempt
def login(request):
    if request.method=='POST':
        respuesta={}

        userGW=UserGateway(database)
        fileGW=FileGateway(database)
        filesystem=Filesystem(database)
        userJson=json.loads(request.POST['user'])
        
        user=User(userGW.getUser(userJson['nick']))
        if user is not None:
            print(user.get_password())
            if security.verifyPassword(userJson['password'],user.get_password()):
                root=filesystem.getNode(user.get_nick())
                respuesta['user']=user.toJSON()
                del respuesta['user']['password']
                respuesta['root']=root
                respuesta['token']=security.generateJWT(user.get_nick())
                respuesta['totalModelos']=filesystem.getNumberOfModels(user.get_nick())
                
                return JsonResponse(respuesta,status=200,safe=False)
            return JsonResponse({},status=401,safe=False)
        return JsonResponse(respuesta,status=404,safe=False)
    return JsonResponse({},status=404,safe=False)

@csrf_exempt
def signup(request):
    if request.method=='POST':
        respuesta={}

        userGW=UserGateway(database)
        fileGW=FileGateway(database)
        filesystem=Filesystem(database)
        userJson=json.loads(request.POST['user'])
            
        user=User(userJson)
        user.set_password(security.createPassword(user.get_password()))
        if not userGW.exists(user.get_nick()):
            if userGW.insertUser(user):
                file=filesystem.create(user.get_nick())
                if fileGW.insertFile(file):
                    respuesta['user']=user.toJSON()
                    del respuesta['user']['password']
                    respuesta['root']=file.toJSON()
                    respuesta['root']['hijos']=[]
                    respuesta['token']=security.generateJWT(user.get_nick())
                    respuesta['totalModelos']=0
                    
                    return JsonResponse(respuesta,status=201,safe=False)
            return JsonResponse(respuesta,status=500,safe=False)
        return JsonResponse(respuesta,status=409,safe=False)
    return JsonResponse({},status=404,safe=False)


@csrf_exempt
def move(request):
    if request.method=='POST':
        respuesta={}

        userGW=UserGateway(database)
        fileGW=FileGateway(database)
        filesystem=Filesystem(database)
        datos=json.loads(request.POST['datos'])
            
        filesystem.move(datos['idModel'],datos['idFolder'])
        return JsonResponse({},status=200,safe=False)
    return JsonResponse({},status=404,safe=False)

"""
metodo que sirve para obtener la escala de la pieza ceramica,
obtiene como resultado el numero de pixeles por centimetro de figura
"""
def get_size_object(request):
    respuesta={}
    
    datos=json.loads(request.POST['datos'])
    imgRead=bytearray(datos['imagen'],'utf8')
    img=img_analyze.data_uri_to_cv2_img(datos['imagen'])
    
    contornos=img_analyze.getContornos(img)
    menor=img_analyze.getContornoMinimo(contornos)
    x1,y1,w1,h1 = img_analyze.cv2.boundingRect(menor)
    
    respuesta['ppcm']=w1

    return JsonResponse(respuesta,status=200)


"""
metodo que sirve para obtener el perfil de revolucion 
de la figura ceramica a partir de una imagen
"""
def get_profile_object(request):
    respuesta={}
    
    datos=json.loads(request.POST['datos'])
    imgRead=bytearray(datos['imagen'],'utf8')
    img=img_analyze.data_uri_to_cv2_img(datos['imagen'])
    check = img_analyze.checkearImagen(img)

    if check[0]:
        datos=img_analyze.obtenerPerfil(img)
        respuesta['datos']=datos[0][0]
        respuesta['w']=datos[0][1]
        respuesta['h']=datos[0][2]
        respuesta['diff']=datos[0][3]
        respuesta['tamanio']=1

        return JsonResponse(respuesta,status=200,safe=False)
    return JsonResponse(respuesta,status=500,safe=False)

def getFile(request,id):
    respuesta={}
    filesystem=Filesystem(database)
    file=filesystem.getNode(id)

    respuesta['file']=file
    return JsonResponse(respuesta,status=200,safe=False)


"""
metodo que sirve para crear un archivo (modelo,carpeta) en el sistema 
del usuario
"""
def insertFile(request):
    fileGW=FileGateway(database)
    file=File(json.loads(request.POST['file']))
    if fileGW.insertFile(file):
        return JsonResponse({'file':file.toJSON()},status=201,safe=False)
    return JsonResponse({},status=500,safe=False)


"""
actualizar la informacion de un archivo completo
"""
def updateFile(request,id):
    respuesta={}
    fileGW=FileGateway(database)
    file=File(json.loads(request.POST['file']))
    fileJson=fileGW.updateFile(id,file)
    respuesta['file']=fileJson
    return JsonResponse(respuesta,status=200,safe=False)

"""
actualiza la informacion de las propiedades pasadas en el "body request" 
"""
def patchFile(request,id):

    fileGW=FileGateway(database)
    patched_properties=json.loads(request.body)
    if fileGW.patchFile(id,patched_properties):
        return JsonResponse({},status=200,safe=False)
    return JsonResponse({},status=500,safe=False)


"""
elimina un archivo del sistema del usuario, en caso de ser una carpeta
elimina tambien su contenido
"""
def deleteFile(request,id):
    respuesta={}
    filesystem=Filesystem(database)
    if filesystem.deleteNode(id):
        return JsonResponse(respuesta,status=200,safe=False)
    return JsonResponse(respuesta,status=500,safe=False)

"""
elimina varios archivos del sistema del usuario, en caso de ser una carpeta
elimina tambien su contenido
"""
def deleteFiles(request):
    respuesta={}
    fileGW=FileGateway(database)
    list_files=json.loads(request.body)['files']
    print(list_files)
    for i in range(len(list_files)):
        fileGW.deleteFile(list_files[i])
    return JsonResponse(respuesta,status=200,safe=False)

"""
filtra los archivos del usuario segun las propiedades pasadas por GET
"""
def listFiles(request):
    filters=json.loads(request.GET.dict())
    fileGW=FileGateway(database)
    files=fileGW.listFiles(filters)
    return JsonResponse({'files':files},status=200,safe=False)

"""
obtener informacion de un usuario a partir de su identificador
"""
def getUser(request,id):
    respuesta={}
    userGW=UserGateway(database)
    user=userGW.getUser(id)

    respuesta['user']=user
    return JsonResponse(respuesta,status=200,safe=False)

"""
crear un usuario nuevo en el sistema
"""
def insertUser(request):
    userGW=UserGateway(database)
    user=User(json.loads(request.POST['user']))
    if userGW.insertUser(user):
        return JsonResponse({'user':user.toJSON()},status=201,safe=False)
    return JsonResponse({},status=500,safe=False)

"""
actualizar la informacion de un usuario en el sistema
"""
def updateUser(request,id):
    respuesta={}
    userGW=UserGateway(database)
    user=User(json.loads(request.POST['user']))
    userJson=userGW.updateUser(id,user)
    respuesta['user']=userJson
    return JsonResponse(respuesta,status=200,safe=False)

"""
actualizar algunas propiedades del usuario
"""
def patchUser(request,id):

    userGW=UserGateway(database)
    patched_properties=json.loads(request.body)
    if userGW.patchUser(id,patched_properties):
        return JsonResponse({},status=200,safe=False)
    return JsonResponse({},status=500,safe=False)


"""
borrar un usuario del sistema
"""
def deleteUser(request,id):
    userGW=UserGateway(database)

    if userGW.deleteUser(id):
        return JsonResponse({},status=200,safe=False)
    return JsonResponse({},status=500,safe=False)

