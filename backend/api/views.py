from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, DocumentSerializer, ConversationSerializer, TagSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Document,Conversation,Tag
import os
# umesto da se vraca render kao kod klasicnog Djanga, kreiraju se fje/klase koje primaju json podatke za react frontend
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all() # odnosi se na celu tabelu user
    serializer_class = UserSerializer # koristi ovaj serijalizer
    permission_classes = [AllowAny] # svako moze da kreira novog usera

class DeleteUserView(generics.DestroyAPIView): 
    def get_queryset(self): # ako je staff moze da brise sve, ako nije ne moze nista
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(uesr=self.request.user)

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if self.request.user.is_staff:
            instance.delete()

class UploadDocumentView(generics.ListCreateAPIView): # jer kreiramo red u tabeli
    def get_queryset(self):
        if self.request.user.is_staff: # ako je staff onda vidi sve
            return Document.objects.all()
        user = self.request.user # user postaje trenutno ulogovani user
        return Document.objects.filter(user=user) # ne veacamo sve dokumente, nego filtriramo samo one od ulogovanog usera
    
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer): # ovde back setuje usera koji je kreirao doc, a to je trenutno ulogovani user
        serializer.save(user=self.request.user, file_type=os.path.splitext(self.request.FILES.get('file').name)[1])
    # serializer kreira objekat klase document, kada ga kreira on uz pomoc save() samo zalepi i usera

class EditDocumentView(generics.UpdateAPIView): # mzd da staff moze da edituje svima
    def get_queryset(self):
        user = self.request.user 
        return Document.objects.filter(user=user)
    
    serializer_class = DocumentSerializer # ovo mzd ni ne treba
    permission_classes = [IsAuthenticated]

class DeleteDocumentView(generics.DestroyAPIView):
    def get_queryset(self):
        if self.request.user.is_staff: # staff moze da brise svacije doc
            return Document.objects.all()
        user = self.request.user 
        return Document.objects.filter(user=user)
    # takodje dodati da admin moz brise sve
    serializer_class = DocumentSerializer # ovo mzd ni ne treba
    permission_classes = [IsAuthenticated]

class StartConversationView(generics.ListCreateAPIView):
    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(user=user) # dodati da mzd filtrira i po is_saved
    
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # history = self.request.data.get("conversationContent")
        # if history:
        #     first_message = history[0] STAGOD SAMO DOVRSI POSLE...
        serializer.save(user=self.request.user, name="New convo")

class DeleteConversationView(generics.DestroyAPIView):
    def get_queryset(self):
        user = self.request.user 
        return Conversation.objects.filter(user=user)
    
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

class ContinueConversationView(generics.UpdateAPIView): # doraditi kada implementiramo ai!
    def get_queryset(self):
        user = self.request.user 
        return Conversation.objects.filter(user=user)
    
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

class CreateTagView(generics.CreateAPIView):
    def get_queryset(self):
        user = self.request.user 
        return Tag.objects.filter(user=user)
    
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EditTagView(generics.UpdateAPIView):
    def get_queryset(self):
        user = self.request.user 
        return Tag.objects.filter(user=user)

    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

class DeleteTagView(generics.DestroyAPIView):
    def get_queryset(self):
        if self.request.user.is_staff:
            return Tag.objects.all()
        user = self.request.user 
        return Tag.objects.filter(user=user)

    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]