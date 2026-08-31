from django.contrib.auth.models import User
from django.test import TestCase

from ..models import Document, Tag, Conversation, Paragraph


class DocumentModelTests(TestCase):

    def setUp(self): # priprema korisnika koji ce biti koriscen ya sve testove
        self.user = User.objects.create_user(
            username="testuser", password="TestPass123"
        )

    def test_document_str_representation(self): # zbog test_ django automatski prepozna da je to za testiranje
        document = Document.objects.create(
            title="Test dokument",
            file="documents/test.txt",
            file_type=".txt",
            description="opis",
            user=self.user,
        )
        self.assertIn("Test dokument", str(document)) # da li se prvi arg nalazi u drugom 

    def test_document_belongs_to_correct_user(self):
        document = Document.objects.create(
            title="Test dokument",
            file="documents/test.txt",
            file_type=".txt",
            user=self.user,
        )
        self.assertEqual(document.user, self.user) # da li su ova dva arg identicna
        self.assertEqual(self.user.documents.count(), 1) # da li korisnik ima 1 dokument


class TagModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="tagger", password="TestPass123"
        )

    def test_tag_creation(self):
        tag = Tag.objects.create(name="posao", color="#ff0000", user=self.user)
        self.assertEqual(tag.name, "posao") # da li je name polje sacuvano tacno onako kako smo ga uneli
        self.assertEqual(tag.user, self.user) # a li je user  ispravno povezan


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
        self.assertEqual(paragraph.document, self.document) # da li paragraf zna svoj dokument i da dokument zna svoje paragrafe
        self.assertEqual(self.document.paragraphs.count(), 1)

    def test_paragraphs_deleted_when_document_deleted(self):
        Paragraph.objects.create(document=self.document, content="tekst", position=1)
        self.document.delete()
        self.assertEqual(Paragraph.objects.count(), 0) # da li radi CASCADE


class ConversationModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="convuser", password="TestPass123"
        )

    def test_conversation_defaults(self):
        conversation = Conversation.objects.create(name="Prvi razgovor", user=self.user)
        self.assertEqual(conversation.conversationContent, []) # da li je na pocetku konverzacija prazna lsita (navedeno u models)
        self.assertFalse(conversation.isSaved) # da li je po defaultu False