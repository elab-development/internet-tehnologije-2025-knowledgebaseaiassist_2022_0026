from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("user/register/", views.RegisterUserView.as_view(), name="register"),# as_view fakticki poziva klasu
    path("user/profile/", views.UserProfileView.as_view(), name="user_profile"),
    path("user/delete/<int:pk>/", views.DeleteUserView.as_view(), name="delete_user"),
    path("token/get/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("document/upload/", views.UploadDocumentView.as_view(), name="upload_document"),
    path("document/delete/<int:pk>/", views.DeleteDocumentView.as_view(), name="delete_document"),
    path("document/edit/<int:pk>/", views.EditDocumentView.as_view(), name="edit_document"),
    path("conversation/new/", views.StartConversationView.as_view(), name="new_conversation"),
    path("conversation/delete/<int:pk>/", views.DeleteConversationView.as_view(), name="delete_conversation"),
    path("conversation/continue/<int:pk>/", views.ContinueConversationView.as_view(), name="continue_conversation"),
    path("tag/create/", views.CreateTagView.as_view(), name="create_tag"),
    path("tag/delete/<int:pk>/", views.DeleteTagView.as_view(), name="delete_tag"),
    path("tag/edit/<int:pk>/", views.EditTagView.as_view(), name="edit_tag"),
]
