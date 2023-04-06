from django.urls import path
from . import views

app_name    = "myapp"
urlpatterns = [
    path('draw', views.draw, name="draw"),
    path('',views.drawVue, name="drawVue"),
    path('index', views.index , name="index"),
]