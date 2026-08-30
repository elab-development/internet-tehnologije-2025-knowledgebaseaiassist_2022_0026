from unittest.mock import patch
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status


class UserWorkflowTests(APITestCase):

    @patch("api.views.add_paragraphs")
    def test_user_can_register_login_upload_and_delete_document(self, mock_add_paragraphs):
        # registracija
        register_response = self.client.post("/api/user/register/", {
            "username": "kompletankorisnik",
            "password": "SigurnaLozinka123",
            "email": "kompletan@test.com",
        })
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        # login
        login_response = self.client.post("/api/token/get/", {
            "username": "kompletankorisnik",
            "password": "SigurnaLozinka123",
        })
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        # upload dokumenta
        file = SimpleUploadedFile("moja_beleska.txt", b"Sadrzaj beleske.", content_type="text/plain")
        upload_response = self.client.post("/api/document/upload/", {
            "title": "Moja prva beleska",
            "file": file,
        }, format="multipart")
        self.assertEqual(upload_response.status_code, status.HTTP_201_CREATED)
        document_id = upload_response.data["id"]

        # dokument se pojavljuje na listi korisnika
        list_response = self.client.get("/api/document/upload/")
        titles = [doc["title"] for doc in list_response.data]
        self.assertIn("Moja prva beleska", titles)

        # brisanje dokumenta
        delete_response = self.client.delete(f"/api/document/delete/{document_id}/")
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)

        # dokument vise nije na listi
        list_response_after = self.client.get("/api/document/upload/")
        titles_after = [doc["title"] for doc in list_response_after.data]
        self.assertNotIn("Moja prva beleska", titles_after)