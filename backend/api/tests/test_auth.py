from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status


class RegisterTests(APITestCase):

    def test_register_creates_user(self):
        response = self.client.post("/api/user/register/", {
            "username": "novikorisnik",
            "password": "SigurnaLozinka123",
            "email": "novi@test.com",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="novikorisnik").exists())

    def test_register_hashes_password(self):
        self.client.post("/api/user/register/", {
            "username": "novikorisnik2",
            "password": "SigurnaLozinka123",
            "email": "novi2@test.com",
        })
        user = User.objects.get(username="novikorisnik2")
        self.assertNotEqual(user.password, "SigurnaLozinka123")

    def test_register_password_not_in_response(self):
        response = self.client.post("/api/user/register/", {
            "username": "novikorisnik3",
            "password": "SigurnaLozinka123",
            "email": "novi3@test.com",
        })
        self.assertNotIn("password", response.data)

    def test_register_duplicate_username_fails(self):
        User.objects.create_user(username="postojeci", password="Lozinka123")
        response = self.client.post("/api/user/register/", {
            "username": "postojeci",
            "password": "DrugaLozinka123",
            "email": "drugi@test.com",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="loginuser", password="TacnaLozinka123"
        )

    def test_login_with_correct_credentials(self):
        response = self.client.post("/api/token/get/", {
            "username": "loginuser",
            "password": "TacnaLozinka123",
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_with_wrong_password_fails(self):
        response = self.client.post("/api/token/get/", {
            "username": "loginuser",
            "password": "PogresnaLozinka",
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_sqli_attempt_fails(self):
        response = self.client.post("/api/token/get/", {
            "username": "' OR 1=1--",
            "password": "bilo sta",
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)