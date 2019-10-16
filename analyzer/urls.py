from django.urls import path
from django.conf.urls import url

from .views import views_login
from .views.views_dashboard import *

urlpatterns = [
    # Dashboard
    path('', dashboard_view, name='index'),
    path('dashboard_analyzers', dashboard_analyzers, name='dashboard_analyzers'),
    path('dashboard_access_points', dashboard_access_points, name='dashboard_access_points'),
    path('dashboard_head_unit', dashboard_head_unit, name='dashboard_head_unit'),
    path('dashboard_troubles', dashboard_troubles, name='dashboard_troubles'),
    path('dashboard_ch_analysis', dashboard_channel_analysis, name='dashboard_channel_analysis'),
    path('dashboard_graph', dashboard_graph, name='dashboard_graph'),
    # Login
    path('login/', views_login.login_view, name='login'),
    path('logout/', views_login.logout_view, name='logout'),
]
