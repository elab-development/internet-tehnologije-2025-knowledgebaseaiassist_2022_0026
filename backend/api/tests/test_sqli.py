from unittest.mock import patch
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status

from ..models import Document


SQLI_PAYLOADS = [
    "' OR 1=1 --",
    "' OR 'a'='a",
    "admin'--",
    "admin'/*",
    "' UNION SELECT username, password, 3, 4, 5, 6, 7 FROM auth_user--",
    "'; DROP TABLE api_document;--",
    "' AND 1=1--",
    "' AND 1=2--",
]


class SQLInjectionLoginTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="pravikorisnik", password="StvarnaLozinka123"
        )

    def test_sqli_in_username_does_not_bypass_login(self):
        for payload in SQLI_PAYLOADS:
            with self.subTest(payload=payload):
                response = self.client.post("/api/token/get/", {
                    "username": payload,
                    "password": "bilo sta",
                })
                self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_sqli_in_password_does_not_bypass_login(self):
        for payload in SQLI_PAYLOADS:
            with self.subTest(payload=payload):
                response = self.client.post("/api/token/get/", {
                    "username": "pravikorisnik",
                    "password": payload,
                })
                self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class SQLInjectionDocumentTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="uploader", password="Lozinka123")
        self.client.force_authenticate(user=self.user)

    @patch("api.views.add_paragraphs")
    def test_sqli_payloads_stored_as_literal_text(self, mock_add_paragraphs):
        for payload in SQLI_PAYLOADS:
            with self.subTest(payload=payload):
                file = SimpleUploadedFile("test.txt", b"sadrzaj", content_type="text/plain")

                response = self.client.post("/api/document/upload/", {
                    "title": payload,
                    "file": file,
                }, format="multipart")

                self.assertEqual(response.status_code, status.HTTP_201_CREATED)

                document = Document.objects.get(id=response.data["id"])
                self.assertEqual(document.title, payload)

    @patch("api.views.add_paragraphs")
    def test_drop_table_payload_does_not_delete_table(self, mock_add_paragraphs):
        file = SimpleUploadedFile("test.txt", b"sadrzaj", content_type="text/plain")

        self.client.post("/api/document/upload/", {
            "title": "'; DROP TABLE api_document;--",
            "file": file,
        }, format="multipart")

        count = Document.objects.count()
        self.assertGreaterEqual(count, 1)