from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

# umesto da se vraca render kao kod klasicnog Djanga, kreiraju se fje/klase koje vracaju json podatke za react frontend

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() 
    serializer_class = UserSerializer
    permission_classes = [AllowAny] # svako moze da kreira novog usera


