from django.urls import path
from django.conf.urls.static import static
from . import views
from django.conf import settings

urlpatterns = [
    path("", views.home, name="home"),
    path("add_review", views.add_review, name="add_review"),
    path("create_review", views.create_review, name="create_review"),
    path("rental_data.json", views.rental_data, name="get_rental_data"),
    path("sign_up", views.sign_up, name = "sign_up"),
]