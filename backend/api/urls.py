from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("user/register/", views.RegisterUserView.as_view(), name="register"),# as_view fakticki poziva klasu
    path("token/get/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("document/upload/", views.UploadDocumentView.as_view(), name="upload_document"),
    path("document/delete/<int:pk>/", views.DeleteDocumentView.as_view(), name="delete_document"),
    path("conversation/new/", views.StartConversationView.as_view(), name="new_conversation"),
    path("conversation/delete/<int:pk>/", views.DeleteConversationView.as_view(), name="delete_conversation"),
    path("conversation/continue/<int:pk>/", views.ContinueConversationView.as_view(), name="continue_conversation")
]
