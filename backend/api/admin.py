from django.contrib import admin
from .models import Conversation,Document,Tag,Paragraph

# Register your models here.
admin.site.register(Document)
admin.site.register(Conversation)
admin.site.register(Tag)
admin.site.register(Paragraph)