from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet,CartViewSet,OrderViewSet,CartListView,UserDetailView

router = DefaultRouter()
router.register('products',ProductViewSet,basename='product')
router.register('cart',CartViewSet,basename='cart')
router.register('orders',OrderViewSet,basename='orders')

urlpatterns = [
    path('', include(router.urls)),
    path('cart-summary/', CartListView.as_view(), name='cart-summary'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
]