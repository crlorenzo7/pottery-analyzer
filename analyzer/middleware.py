import jwt
import re
from analyzer.modules import security
from django.http import HttpResponse, JsonResponse, HttpResponseNotFound


def JWTValidation(get_response):
    # one-time configuration and initialization

    def middleware(request):
        # code to be executed for each request before
        # the view is called; equivalent to process_request
        inApi=True
        
        if re.match(('^/?$'),request.path) is not None:
            inApi=False

        if re.match(('.*signup/?'),request.path) is not None:
            inApi=False
        
        if re.match(('.*login/?'),request.path) is not None:
            inApi=False


        if inApi:
            if 'HTTP_AUTHORIZATION' in request.META:
                bearer=request.META['HTTP_AUTHORIZATION'].split("'")[1]
                if security.verificarJWT(bearer) is  None:
                    return JsonResponse({},status=401,safe=False)
            else:
                return JsonResponse({},status=401,safe=False)
            
        response = get_response(request)
        return response

    return middleware