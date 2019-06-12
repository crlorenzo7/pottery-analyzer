import numpy as np
import cv2
import json
import math
import base64
import re
from PIL import Image
from io import BytesIO


"""
Modudulo que contiene las funciones utiles relacionadas con
el analisis de imagenes y la extraccion de contornos
"""

def getContornos(img):
    """
    obtiene los contornos de una imagen mediante OpenCV
    parametros:
    img -> imagen sobre la que extraer los contornos
    """
    imgR=img.copy()
    (h,w) = imgR.shape[:2]

    imgR =cv2.cvtColor(imgR,cv2.COLOR_BGR2GRAY)
    contornos, hierarchy = cv2.findContours(imgR, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
    return contornos

def getContornoMaximo(contornos):
    """
    Recibe una lista de contornos y retorna el que cubre una area 
    rectangular mayor
    parametros:
    contornos -> lista de contornos extraidos de la imagen
    """
    mayor=contornos[0]   
    for i in range(1,len(contornos)):
        x1,y1,w1,h1 = cv2.boundingRect(mayor)
        x2,y2,w2,h2 = cv2.boundingRect(contornos[i])
        if (w1*h1) < (w2*h2):
            mayor=contornos[i]
    return mayor

def getContornoMinimo(contornos):
    """
    Recibe una lista de contornos y retorna el que cubre una area 
    rectangular menor
    parametros:
    contornos -> lista de contornos extraidos de la imagen
    """
    menor=contornos[0]
    for i in range(1,len(contornos)):
        x1,y1,w1,h1 = cv2.boundingRect(menor)
        x2,y2,w2,h2 = cv2.boundingRect(contornos[i])
        if (w1*h1) > (w2*h2):
            menor=contornos[i]
    return menor


def checkearImagen(img):
    """
    Recibe una imagen y detecta si es una imagen validad para analizar
    parametros:
    img -> imagen para analizar
    """
    contornos = getContornos(img)
    if not(contornos is None):
        contornoMaximo = getContornoMaximo(contornos)

        img=getImagenObjeto(img,0)

        return [True,img]
    else:
        return [False,0]

def getImagenObjeto(img,n):
    """
    Recibe una imagen y un numero y recorta la imagen para encuadrar
    el objeto de analisis
    img -> imagen para analizar
    n -> indica si hay que ordenar los contornos por area 1 o no 0
    """
    contornos = getContornos(img)
    if n==0:
        contornoMaximo = getContornoMaximo(contornos)
    else:
        contornos=ordenarContornosPorArea(contornos)
        contornoMaximo = contornos[4]
    (x,y,w,h) = cv2.boundingRect(contornoMaximo)
    
 
    base = img[0:,(x-10):(x+w)]

    return base


def contieneDato(datos,dato):
    """
    comprueba si un dato ya existe en un conjunto de datos
    datos -> lista de datos
    dato -> dato para comprobar si existe
    """
    encontrado=False
    i=0
    while i <len(datos) and not encontrado:
        if abs(datos[i][0]-dato[0])<5 and abs(datos[i][1]-dato[1])<5:
            encontrado=True
        i=i+1
    return encontrado

def getNextMove(img,nextPoint):
    """
    dentro del proceso de reconocimiento del patron, recibe una imagen y encuentra 
    el siguiente punto de la imagen a analizar

    parametros:
    img -> imagen sobre la que se esta trabajando
    nextpoint -> pixel central sobre el que se analiza
    """
    (h,w)=img.shape[:2]
    encontrado=False
    for i in range(nextPoint[0]-1,nextPoint[0]+2):
        if i < h:
            for j in range(nextPoint[1]-1,nextPoint[1]+2):
                if j < w:
                    if isVerde(img[i][j]) and (i!=nextPoint[0] or j!=nextPoint[1]):
                        encontrado=True
                        img[nextPoint[0]][nextPoint[1]][0]=img[nextPoint[0]][nextPoint[1]][1]=img[nextPoint[0]][nextPoint[1]][2]=0
                        return [i,j]
    if not encontrado:
        for i in range(nextPoint[0]-7,nextPoint[0]+8):
            if i < h:
                for j in range(nextPoint[1]-7,nextPoint[1]+8):
                    if j < w:
                        if isVerde(img[i][j]) and (i!=nextPoint[0] or j!=nextPoint[1]):
                            encontrado=True
                            img[nextPoint[0]][nextPoint[1]][0]=img[nextPoint[0]][nextPoint[1]][1]=img[nextPoint[0]][nextPoint[1]][2]=0
                            return [i,j]
    return 0

def contieneDatoFinal(keypoints,test):
    i=0
    encontrado=False
    while i < len(keypoints) and not encontrado:
        if abs(keypoints[i][0]-test[1])<5 and abs(keypoints[i][1]-test[0])<5:
            keypoints[i]=[-1,-1,-1]
            encontrado=True
        i=i+1
    return encontrado             

def reconocerPatron(img,punto,datosComparacion,diff):
    """
    algoritmo usado para ordenar los puntos del contorno obtenido
    recorriendo el contorno obtenido y comparando cada punto con los datos
    obtenidos del contorno
    
    parametros:
    img -> imagen sobre la que se esta trabajando
    nextpoint -> punto inicial del analisis
    datosComparacion -> lista de datos
    diff -> diferencia de altura entre el patron y el punto 0 del eje Y
    """
    (h,w)=img.shape[:2]
    finalPatron=False
    nextPoint=punto
    datosFinales=[]

    while not finalPatron:
        if contieneDatoFinal(datosComparacion,nextPoint):
            datosFinales.append([w-float(nextPoint[1]),float(h-(nextPoint[0])),float(0)])

        nextPoint=getNextMove(img,nextPoint)
        if nextPoint==0:
            finalPatron=True
        else:
            print(nextPoint)
    return [datosFinales,w,h,diff]
    


def detectarInicioPatron(img):
    """
    funcion que obtiene el inicio del contorno recorriendo el eje de 
    simetria de la imagen da abajo a arriba hasta que encuentra un punto del contorno
    
    parametros:
    img -> imagen analizada
    """
    (h,w)=img.shape[:2]
    i=h-1
    j=w-1
    encontrado=False
    while j > 0 and not encontrado:
        while i > 0 and not encontrado:
            if isVerde(img[i][j]):
                encontrado=True
            else:
                i=i-1
        if not encontrado:
            j=j-1

    return [i,j]
    

def obtenerPerfil(img):
    """
    algoritmo para obtener un perfil en forma de una lista de puntos, 
    a partir de una imagen
    
    parametros:
    img -> imagen analizada
    """
    (h,w) = img.shape[:2]
    imgc= np.zeros((h,w,3),np.uint8)
    imgc2= np.zeros((h,w,3),np.uint8)
    contornos = getContornos(img)
    contornoMaximo = getContornoMaximo(contornos)
    
    (x1,y1,w1,h1) = cv2.boundingRect(contornoMaximo)
    epsilon = 0.0001*cv2.arcLength(contornoMaximo,True)
    approx = cv2.approxPolyDP(contornoMaximo,epsilon,True)
    cv2.drawContours(imgc, contornoMaximo, -1, (0,255,0), 1,cv2.LINE_8)
    cv2.drawContours(imgc2, approx, -1, (0,255,0), 1,cv2.LINE_8)

    diffSuelo = h -(y1+h1)

    datosContorno=[]
    datos=[]
    datosOrdenados=[]
    for j in range(len(approx)):
        
        dato=[]
        dato.append(approx[j][0][0])
        dato.append(approx[j][0][1])
        dato.append(0)
        if not contieneDato(datos,dato):
            datos.append(dato)


    puntoInicial=detectarInicioPatron(imgc)
    datosOrdenados=reconocerPatron(imgc,puntoInicial,datos,diffSuelo)

    datosContorno.append(datosOrdenados)

    return datosContorno

def ordenarContornosPorArea(contornos):
    """
    recibe una lista de contornos y los ordena por su area de mayor a menor
    
    parametros:
    contornos -> lista de contornos
    """
    for i in range(len(contornos)-1):
        for j in range(1,len(contornos)):
            x1,y1,w1,h1 = cv2.boundingRect(contornos[j])
            x2,y2,w2,h2 = cv2.boundingRect(contornos[j-1])
            if (w1*h1) > (w2*h2):
                caux=contornos[j]
                contornos[j]=contornos[j-1]
                contornos[j-1]=caux
    return contornos

def isVerde(punto):
    """
    comprueba si un pixel es de color verde
    
    parametros:
    punto -> pixel analizado
    """
    if punto[0]==0 and punto[1]==255 and punto[2]==0:
        return True
    return False

def isNegro(punto):
    """
    comprueba si un pixel es de color negro
    
    parametros:
    punto -> pixel analizado
    """
    if punto[0]==0 and punto[1]==0 and punto[2]==0:
        return True
    return False

def isRojo(punto):
    """
    comprueba si un pixel es de color rojo
    
    parametros:
    punto -> pixel analizado
    """
    if punto[0]==0 and punto[1]==0 and punto[2]==255:
        return True
    return False

def data_uri_to_cv2_img(uri):
    """
    obtiene la imagen para analizar a partir de una imagen en base64
    
    parametros:
    uri -> imagen en base64
    """
    image_data = base64.b64decode(bytearray(re.sub('^data:image/.+;base64,', '', uri),'utf8'))
    image_PIL = Image.open(BytesIO(image_data))
    image_np = np.array(image_PIL)
    return image_np