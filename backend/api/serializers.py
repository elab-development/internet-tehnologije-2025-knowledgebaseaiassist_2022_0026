from django.contrib.auth.models import User
from rest_framework import serializers # most između tvoje baze podataka (gde su podaci u tabelama) i Frontenda (koji razume samo JSON).
from .models import Document, Conversation, Tag, Paragraph
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
    
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        extra_kwargs = {"user":{"read_only":True}} # to sto je read only se setuje kroz views
        
class ParagraphSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Paragraph
        fields = '__all__'
        read_only_fields = ['document']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__' # samo uzme sva polja iz document
        read_only_fields = ['user', 'file_type', 'uploaded_at'] # setovano od strane backa, nije nesto sto cemo mi uneti

    # tag ne sme da bude read_only jer bi to znacilo da korisnik ne sme da ga postavlja
    # zato ova metoda proverava da li je tag ispravan za taj dokument kako bi se izbegao idor
    # odnosno proverava da li ti tagovi pripadaju tom useru
    # da nema ovog user bi mogao da postavi tagove sa nekim random idevima RPOVERITI TO POSEL
    def validate_tags(self, value):
        request = self.context.get("request")
        for tag in value:
            if tag.user_id != request.user.id:
                raise serializers.ValidationError("Tag ne postoji.")
        return value

    # da bi se pri citanju dokumenata iz baze, front dobijao Tag objekte a ne ideve
    def to_representation(self, instance):
        representation = super().to_representation(instance) # uzmi instancu dokumenta i nalepi tags
        representation['tags'] = TagSerializer(instance.tags.all(), many=True).data
        return representation

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = '__all__'
        extra_kwargs = {"user":{"read_only":True}}
        
