from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10,decimal_places=2)
    image = models.URLField(blank=True)
    stock = models.IntegerField(default=0)

    def __str__(self):
        return self.title
    
class CartItem(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def subtotal(self):
        return self.quantity * self.product.price
    
class Order(models.Model):
    STATUS = (
        ("pending","Pending"),
        ("paid","Paid")
    )

    user = models.ForeignKey(User,on_delete=models.CASCADE)
    items = models.ManyToManyField(CartItem)
    total_price = models.DecimalField(max_digits=10,decimal_places=2)
    status = models.CharField(max_length=10,choices=STATUS,default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    stripe_payment_intent = models.CharField(max_length=200,blank=True)

    
