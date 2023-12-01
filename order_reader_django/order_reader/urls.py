from django.urls import path
from .views import order_view

urlpatterns = [
    path('orders/', order_view, name='order-list'),
    path('orders/<int:order_id>/',
         order_view, name='order-detail'),
    # path('orders/', OrderView.as_view(), name='order-list'),
    # path('orders/<int:order_id>/',
    # OrderView.as_view(), name='order-detail'),
]
