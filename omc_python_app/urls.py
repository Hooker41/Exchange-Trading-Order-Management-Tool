from django.conf.urls import url
from omc_python_app import views
from django.urls import path

urlpatterns = [
    # url(r'^$', views.HomePageView.as_view()),
    path('api/v1.0/coins/', views.getExchanges ),
    path('api/v1.0/connect', views.connectExchange ),
    path('api/v1.0/disconnect/', views.disconnectExchange ),
    path('api/v1.0/getticker', views.getTicker ),
]