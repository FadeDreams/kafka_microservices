from django.contrib import admin
from django.urls import include, path
from .views import RegisterAPIView, LoginAPIView, UserAPIView, RefreshAPIView, LogoutAPIView, ResetAPIView, ForgotAPIView, DeductCreditsAPIView, AddCreditsAPIView

urlpatterns = [
    path('register', RegisterAPIView.as_view()),
    path('login', LoginAPIView.as_view()),
    path('refresh', RefreshAPIView.as_view()),
    path('user', UserAPIView.as_view()),
    path('logout', LogoutAPIView.as_view()),
    path('forgot', ForgotAPIView.as_view()),
    path('reset', ResetAPIView.as_view()),
    path('deduct', DeductCreditsAPIView.as_view()),
    path('add', AddCreditsAPIView.as_view()),
]
