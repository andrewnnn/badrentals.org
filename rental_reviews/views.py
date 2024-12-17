from django.shortcuts import render, redirect
from django import forms
from rental_reviews.models import Review, Address

from django.http import HttpResponse


def index(request):
  return render(request, "rental_reviews/index.html")

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