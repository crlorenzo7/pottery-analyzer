
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse, HttpResponseNotFound
import datetime 

def index(request):
    if request.method=='GET':
        contexto={}
        contexto['time']=datetime.datetime.now().timestamp
        return render(request,'index.html',contexto)
    return HttpResponseNotFound('<h1>Page not found</h1>')