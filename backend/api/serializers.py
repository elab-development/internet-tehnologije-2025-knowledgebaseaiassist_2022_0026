from django.contrib.auth.models import User
from rest_framework import serializers
# prihvatamo json podatke i vracamo json podatke frontendu
# serializer pajton objekte transformise u json i obrnuto

class UserSerializer(serializers.ModelSerializer):
    class Meta: # metapodaci, definisemo sta pakujemo u json
        model = User
        fields = ["id","username","password","email","first_name","last_name","is_superuser"] # mozemo da dodamo email
        extra_kwargs = {"password":{"write_only":True}} # prihvatamo sifru ali ne vracamo kao podatak
        # django apparently automatski hendluje id

    def create(self,provereni_podaci):
        user = User.objects.create_user(**provereni_podaci) # raspakuje podatke
        # create_user hashuje sifru u bazi
        return user