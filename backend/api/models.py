from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Document(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="documents/")
    file_type = models.CharField(max_length=10) # izmeniti da sistem sam prepozna fajl tip i dodati samo da se prihvataju predefinisani tipvo
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="documents")

    def __str__(self):
        return f"title: {self.title}, file: {self.file}, file_type: {self.file_type}, uploaded_at: {self.uploaded_at}, description: {self.description}, user_id: {self.user}"

class Conversation(models.Model):
    name = models.CharField(max_length=20)
    dateTimeCreated = models.DateTimeField(auto_now_add=True)
    conversationContent = models.JSONField(default=list) # lakse cuvati u jsonu zbog pristupa pitanjima i odgovorima
    isSaved = models.BooleanField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="conversations")

    def __str__(self):
        return f"name: {self.name}, dateTimeCreated: {self.dateTimeCreated}, isSaved: {self.isSaved}, user_id: {self.user}"