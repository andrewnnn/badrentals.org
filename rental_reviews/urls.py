from django.urls import path
from django.conf.urls.static import static
from . import views
from django.conf import settings

urlpatterns = [
    path("", views.index, name="index"),
    path("add_review", views.add_review, name="add_review"),
    path("create_review", views.create_review, name="create_review"),
    path("rental_data.json", views.rental_data, name="get_rental_data"),
]