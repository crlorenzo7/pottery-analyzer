from django.contrib import admin
from django.urls import path, include,re_path
from analyzer import api, views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    re_path(r'^$',views.index,name='index'),
    re_path(r'^users/?$',api.manage_http_users,name="manage_http_users"),
    path('users/<id>/',api.manage_http_users_id,name="manage_http_users_id"),
    path('images/<action>/',api.manage_http_images,name="manage_http_images"),
    re_path(r'^files/?$',api.manage_http_files,name="manage_http_files"),
    path('files/move/',api.move,name="move"),
    path('files/<id>/',api.manage_http_files_id,name="manage_http_files_id"),
    re_path(r'^login/?$',api.login,name="login"),
    re_path(r'^signup/?$',api.signup,name="signup"),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)