from django.contrib.auth.models import User
from rest_framework import serializers # most između tvoje baze podataka (gde su podaci u tabelama) i Frontenda (koji razume samo JSON).
from .models import Document, Conversation, Tag
# prihvatamo json podatke i vracamo json podatke frontendu
# serializer pajton objekte transformise u json i obrnuto

class UserSerializer(serializers.ModelSerializer): # inheritance
    class Meta: # metapodaci, definisemo sta pakujemo u json
        model = User # radi se o modelu user koji smo importovali
        fields = ["id","username","password","email","first_name","last_name","is_staff"]
        extra_kwargs = {"password":{"write_only":True},
                        "is_staff": {"read_only":True}
        } # prihvatamo sifru ali ne vracamo kao podatak
        # django apparently automatski hendluje id

    def create(self,provereni_podaci):
        user = User.objects.create_user(**provereni_podaci) # raspakuje podatke
        # create_user hashuje sifru u bazi
        return user # vrati novokreirani objekat user
    
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__' # samo uzme sva polja iz document
        extra_kwargs = {"user":{"read_only":True},
                        "file_type": {"read_only": True}
        } # setovano od strane backa, nije nesto sto cemo mi uneti
        #i ovde dodati read only za file type


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = '__all__'
        extra_kwargs = {"user":{"read_only":True},
                        "name": {"read_only":True}
        }

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        extra_kwargs = {"user":{"read_only":True}}
        