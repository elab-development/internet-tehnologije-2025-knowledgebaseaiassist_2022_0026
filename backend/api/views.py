from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny

from .services.rag_pipeline import answer_question
from .services.parsers import extract_raw_text
from .services.chunking import chunk_and_save
from .services.vector_store import add_paragraphs, delete_document_vectors
from .serializers import UserSerializer, DocumentSerializer, ConversationSerializer, TagSerializer
from .models import Document, Conversation, Tag

import os
# umesto da se vraca render kao kod klasicnog Djanga, kreiraju se fje/klase koje primaju json podatke za react frontend

class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question = request.data.get("question")
        conversation_id = request.data.get("conversation_id")  # cuvamo koj je konvo

        if not question or not question.strip():
            return Response({"error": "Pitanje ne sme biti prazno"}, status=400)

        try:
            result = answer_question(
                user=request.user, #svaki korisnik izolovana baza znanja, pa mora da se pamti koji je 
                question=question,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=503)

        # cuvamo pitanje i odgovor u konverzaciju postojecu
        if conversation_id:
            try:
                conversation = Conversation.objects.get(id=conversation_id, user=request.user)
                conversation.conversationContent.append({
                    "question": question,
                    "answer": result["answer"],
                    "sources": result["sources"] #posle samo moramo da iskontrolisemo json format od conversationContent
                })
                conversation.save()
            except Conversation.DoesNotExist:
                pass  # da se ne prekida odgovor ako ne moze da se cuva konvo

        return Response(result, status=200)

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
        return User.objects.filter(id=self.request.user.id) # ispravljeno, User nema polje "user", filtriramo po id-ju

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if self.request.user.is_staff:
            instance.delete()

class UploadDocumentView(generics.ListCreateAPIView): # jer kreiramo red u tabeli
    def get_queryset(self):
        if self.request.user.is_superuser: # ako je staff onda vidi sve
            return Document.objects.all()
        user = self.request.user # user postaje trenutno ulogovani user
        return Document.objects.filter(user=user) # ne veacamo sve dokumente, nego filtriramo samo one od ulogovanog usera
    
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        file = self.request.FILES.get('file')
        extension = os.path.splitext(file.name)[1]

        document = serializer.save(user=self.request.user, file_type=extension) # vraca taj dok

        try:
            raw_text = extract_raw_text(document) # parsira fajl u sirov tekst, radi za txt/md/pdf/docx
        except ValueError as e:
            document.delete() # ako je format nepodrzan, brisemo osiroteli red
            raise ValidationError(str(e))

        paragraphs = chunk_and_save(document, raw_text) # deli tekst na chunkove i upisuje Paragraph redove
        add_paragraphs( # indeksira te iste paragrafe u Chroma vektorsku bazu
            paragraphs,
            user_id=document.user.id,
            document_id=document.id,
            document_title=document.title,
        )

class EditDocumentView(generics.UpdateAPIView): # mzd da staff moze da edituje svima
    def get_queryset(self):
        user = self.request.user 
        return Document.objects.filter(user=user)

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        file_obj = self.request.FILES.get('file')
        if file_obj: #ako se menja i fajl onda mora da se racuna novi file type
            document = serializer.save(file_type=os.path.splitext(file_obj.name)[1])

            document.paragraphs.all().delete() # brisemo stare paragrafe iz sqlite
            delete_document_vectors(document.id) # brisemo stare vektore iz chrome

            raw_text = extract_raw_text(document) # reparsiramo novi fajl
            paragraphs = chunk_and_save(document, raw_text)
            add_paragraphs( # reindeksiramo
                paragraphs,
                user_id=document.user.id,
                document_id=document.id,
                document_title=document.title,
            )
        else:
            serializer.save()

class DeleteDocumentView(generics.DestroyAPIView):
    def get_queryset(self):
        if self.request.user.is_superuser: # staff moze da brise svacije doc
            return Document.objects.all()
        user = self.request.user 
        return Document.objects.filter(user=user)
    # takodje dodati da admin moz brise sve
    serializer_class = DocumentSerializer # ovo mzd ni ne treba
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        delete_document_vectors(instance.id) # prvo cistimo vektore, pa tek onda brisemo sam dokument
        instance.delete()

class StartConversationView(generics.ListCreateAPIView):
    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(user=user) # dodati da mzd filtrira i po is_saved
    
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, name="New convo")

class DeleteConversationView(generics.DestroyAPIView):
    def get_queryset(self):
        user = self.request.user 
        return Conversation.objects.filter(user=user)
    
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

class ContinueConversationView(generics.UpdateAPIView): # preimenovanje razgovora i isSaved toggle; AI logika je u ChatView
    def get_queryset(self):
        user = self.request.user 
        return Conversation.objects.filter(user=user)
    
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

class CreateTagView(generics.ListCreateAPIView):
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