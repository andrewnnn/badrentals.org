from django.db import models

class Address(models.Model):
  street = models.CharField(max_length=100)
  suburb = models.CharField(max_length=100)
  state = models.CharField(max_length=100)
  country = models.CharField(max_length=100)
  lat = models.FloatField()
  lon = models.FloatField()

class Review(models.Model):
  address = models.ForeignKey(Address, on_delete=models.CASCADE)
  rating = models.IntegerField()
  review = models.TextField()
  # todo: images
  created_time = models.DateTimeField(auto_now_add=True)
  agency_or_private_landlord = models.CharField(max_length=100)
  agency_name = models.CharField(max_length=100)