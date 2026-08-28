from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, DocumentSerializer, ConversationSerializer, TagSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Document,Conversation,Tag, Paragraph
from docx import Document as WordDocument

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
        return User.objects.filter(user=self.request.user)

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        instance.delete()

class UploadDocumentView(generics.ListCreateAPIView): # jer kreiramo red u tabeli
    def get_queryset(self):
        if self.request.user.is_staff: # ako je staff onda vidi sve
            return Document.objects.all()
        user = self.request.user # user postaje trenutno ulogovani user
        return Document.objects.filter(user=user) # ne veacamo sve dokumente, nego filtriramo samo one od ulogovanog usera
    
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        file = self.request.FILES.get('file')
        extension = os.path.splitext(file.name)[1]

        document = serializer.save(user=self.request.user, file_type=extension) # vraca taj dok

        if extension == '.docx':
            
            word_file = WordDocument(document.file.path)
            position=1

            for p in word_file.paragraphs:
                paragraph = p.text.strip()
                
                if paragraph:
                    Paragraph.objects.create(
                        document=document,
                        content=paragraph,
                        position=position
                    )
                    position+=1
                        
    

class EditDocumentView(generics.UpdateAPIView): # mzd da staff moze da edituje svima
    def get_queryset(self):
        user = self.request.user 
        return Document.objects.filter(user=user)

    serializer_class = DocumentSerializer # ovo mzd ni ne treba
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        file_obj = self.request.FILES.get('file')
        if file_obj: #ako se menja i fajl onda mora da se racuna novi file type
            serializer.save(file_type=os.path.splitext(file_obj.name)[1])
        else:
            serializer.save()

class DeleteDocumentView(generics.DestroyAPIView):
    def get_queryset(self):
        if self.request.user.is_staff: # staff moze da brise svacije doc
            return Document.objects.all()
        user = self.request.user 
        return Document.objects.filter(user=user)
   
    serializer_class = DocumentSerializer
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

class CreateTagView(generics.ListCreateAPIView):    
    def get_queryset(self):
        if self.request.user.is_staff: # staff moze da brise svacije doc
            return Tag.objects.all()
        user = self.request.user # trenutno ulogovani
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