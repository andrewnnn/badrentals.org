from django.shortcuts import render, redirect
from django import forms
from rental_reviews.models import Review, Address

from django.http import HttpResponse
from django.http import JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


def rental_data(request):
    addresses = Address.objects.all()
    reviews = Review.objects.all()

    rental_data = []
    for address in addresses:
        address_reviews = reviews.filter(address=address)
        rental_data.append({
            "address": address.street,
            "suburb": address.suburb,
            "state": address.state,
            "country": address.country,
            "lat": address.lat,
            "lon": address.lon,
            "reviews": list(address_reviews.values())
        })
    
    return JsonResponse(rental_data, safe=False)

def index(request):
    addresses = Address.objects.all()
    reviews = Review.objects.all()

    rental_data = []
    for address in addresses:
        address_reviews = reviews.filter(address=address)
        rental_data.append({
            "address": address.street,
            "suburb": address.suburb,
            "state": address.state,
            "country": address.country,
            "lat": address.lat,
            "lon": address.lon,
            "reviews": address_reviews
        })
    
    context = {
        "rental_data": rental_data
    }

    return render(request, "base_cover.html", context)

def add_review(request):
    return render(request, "rental_reviews/add-review.html", {
        "form": ReviewForm()
    })

def create_review(request):
    form = ReviewForm(request.POST)
    if form.is_valid():
        address = Address(
            street = form.cleaned_data["street"],
            suburb = form.cleaned_data["suburb"],
            state = form.cleaned_data["state"],
            country = form.cleaned_data["country"],
            lat = form.cleaned_data["lat"],
            lon = form.cleaned_data["lon"],
        )
        address.save()
        review = Review(
            address=address,
            rating=form.cleaned_data["rating"],
            review=form.cleaned_data["review"],
            agency_or_private_landlord=form.cleaned_data["agency_or_private_landlord"],
            agency_name=form.cleaned_data["agency_name"],
        )
        review.save()
        return render(request, "rental_reviews/index.html", context={"toast": "Review added!"})
    else:
        return render(request, "rental_reviews/add-review.html", {
            "form": form
        })

    return render(request, "rental_reviews/index.html")

AGENCY_OR_LANDLORD_CHOICES =( 
    ("1", "Agency"), 
    ("2", "Private Landlord"),
) 

class ReviewForm(forms.Form):
    # address
    street = forms.CharField(max_length=100)
    suburb = forms.CharField(max_length=100)
    state = forms.CharField(max_length=100)
    country = forms.CharField(max_length=100)
    lat = forms.FloatField()
    lon = forms.FloatField()

    # review
    rating = forms.IntegerField()
    review = forms.CharField(widget=forms.Textarea)
    agency_or_private_landlord = forms.ChoiceField(choices=AGENCY_OR_LANDLORD_CHOICES)
    agency_name = forms.CharField(max_length=100)

def sign_up(request):
    if request.method == "POST":
        form = RegistrationForm(request.post)

        if form.is_valid():
            user = form.save()
            login(request,user)
            return redirect("/")
    else:
        form = RegistrationForm()
    return render(request, "rental_reviews/register.html", {"form":form})

class RegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password1", "password2"]