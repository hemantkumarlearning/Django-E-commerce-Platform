from rest_framework import serializers
from .models import Product,CartItem,Order
from django.contrib.auth.models import User

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}}

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','password','email']
        extra_kwargs = {'password':{'write_only':True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)