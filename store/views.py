from .serializers import ProductSerializer,CartItemSerializer,OrderSerializer,UserSerializer
from rest_framework import viewsets,status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Product,CartItem,Order
from django.contrib.auth.models import User
from django.conf import settings
import stripe
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAdminUser
import os

stripe.api_key = os.getenv("STRIPE-API-KEY")

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]

class CartViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def get_queryset(self):
        return CartItem.objects.filter(user = self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user = self.request.user)
    
    @action(detail=False, methods=['post'])
    def create_order(self, request):
        user = request.user
        cart_items = CartItem.objects.filter(user=user)
        total = sum([item.subtotal() for item in cart_items])

    # Create Stripe PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=int(total * 100),  # in cents
            currency='usd',
            metadata={'integration_check': 'accept_a_payment'}
        )

    # Create order in DB
        order = Order.objects.create(
            user=user,
            total_price=total,
            stripe_payment_intent=intent['id']
        )
        order.items.set(cart_items)
        order.save()
        cart_items.delete()
        return Response({
            'client_secret': intent['client_secret'],
            'order_id': order.id
        })
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CartListView(APIView):

    def get(self, request):
        cart_items = CartItem.objects.filter(user=request.user).select_related('product')
        data = []

        total = 0

        for item in cart_items:
            subtotal = item.subtotal()
            total += subtotal
            data.append({
                'id': item.id,
                'product': {
                    'id': item.product.id,
                    'title': item.product.title,
                    'price': item.product.price,
                    'image': item.product.image,
                },
                'quantity': item.quantity,
                'subtotal': subtotal
            })

        return Response({
            'items': data,
            'total': total
        })


class UserDetailView(APIView):

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'is_staff': user.is_staff,
        })