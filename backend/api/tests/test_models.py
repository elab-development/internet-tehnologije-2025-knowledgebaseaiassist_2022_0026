from django.contrib.auth.models import User
from django.test import TestCase

from ..models import Document, Tag, Conversation, Paragraph


class DocumentModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="TestPass123"
        )

    def test_document_str_representation(self):
        document = Document.objects.create(
            title="Test dokument",
            file="documents/test.txt",
            file_type=".txt",
            description="opis",
            user=self.user,
        )
        self.assertIn("Test dokument", str(document))

    def test_document_belongs_to_correct_user(self):
        document = Document.objects.create(
            title="Test dokument",
            file="documents/test.txt",
            file_type=".txt",
            user=self.user,
        )
        self.assertEqual(document.user, self.user)
        self.assertEqual(self.user.documents.count(), 1)


class TagModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="tagger", password="TestPass123"
        )

    def test_tag_creation(self):
        tag = Tag.objects.create(name="posao", color="#ff0000", user=self.user)
        self.assertEqual(tag.name, "posao")
        self.assertEqual(tag.user, self.user)


class ParagraphModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="paruser", password="TestPass123"
        )
        self.document = Document.objects.create(
            title="Dokument",
            file="documents/d.txt",
            file_type=".txt",
            user=self.user,
        )

    def test_paragraph_linked_to_document(self):
        paragraph = Paragraph.objects.create(
            document=self.document, content="neki tekst", position=1
        )
        self.assertEqual(paragraph.document, self.document)
        self.assertEqual(self.document.paragraphs.count(), 1)

    def test_paragraphs_deleted_when_document_deleted(self):
        Paragraph.objects.create(document=self.document, content="tekst", position=1)
        self.document.delete()
        self.assertEqual(Paragraph.objects.count(), 0)


class ConversationModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="convuser", password="TestPass123"
        )

    def test_conversation_defaults(self):
        conversation = Conversation.objects.create(name="Prvi razgovor", user=self.user)
        self.assertEqual(conversation.conversationContent, [])
        self.assertFalse(conversation.isSaved)