"""
URL configuration for projectUI project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from django.shortcuts import render
from . import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('popup-diary/', views.popup_diary_view, name='popup_diary'),
    path('chatbot-wordy/', views.chatbot_wordy_view, name='chatbot_wordy'),
    path('main/', views.main_view, name='main'),
    path('main2/', views.main2_view, name='main2'),
    path('voca/', views.voca_view, name='voca'),
    path('mypage/', views.mypage_view, name='mypage'),
    path('api/ai-chat/', views.ai_chat_api, name='ai_chat_api'),
    path('api/ai-chat/init/', views.ai_chat_init, name='ai_chat_init'),
    path('payment1/', views.payment_1_view, name='payment_1'),
    path('payment2/', views.payment_2_view, name='payment_2'),
    path('friend-list/', views.friend_list_view, name='friend_list'),
    path('payment3/', views.payment_3_view, name='payment_3'),
    path('ex-diary/', views.exchange_diary_view, name='exchange_diary'),
    path('bookshelf/', views.bookshelf_view, name='bookshelf'),
    path('essay/', views.popup_essay_view, name='popup_essay'),
    path('ch_diary/', views.ch_diary_view, name='ch_diary'),
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)