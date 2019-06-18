#Pottery Analyzer
###Reconstruccion de piezas cerámicas en 3D

Aplicacion web que, a partir del dibujo arqueologico de una pieza ceramica, recontruye la pieza en 3D

###Intrucciones de ejecucion local

**1. En el directorio del proyecto**
`pip install -r requirements.txt`

**2. dentro del archivo settings.py en la carpeta /pottery**
cambiamos:

`DEBUG=False`

por:

`DEBUG=True`

**3. ejecutamos el servidor**
`python manage.py runserver`

La aplicacion sera accesible en http://localhost:8000/