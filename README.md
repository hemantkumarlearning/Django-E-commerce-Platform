#  Django E-Commerce Platform

This is a simple e-commerce platform built using Django and Django REST Framework (DRF). It supports user registration, login, product listing, cart management, and a checkout process. Basic authentication tokens are used for securing the API. Stripe integration for payments is currently in progress.

## Features

- User registration and login with DRF token authentication
- Browse and view available products
- Add products to cart and proceed to checkout
- Backend powered by Django REST Framework
- Frontend using HTML, CSS, and JavaScript
- Stripe integration for payments (in progress)

## Setup Instructions

1. **Clone the repository**  
   ```
   git clone https://github.com/yourusername/django-ecommerce.git
   cd django-ecommerce
   ```
   
2. **Create and activate virtual environment**

```
python -m venv env
On Windows: venv\Scripts\activate
```

3. **Install dependencies**

```
pip install -r requirements.txt
```

4. **Apply migrations and run server**

```
python manage.py migrate
python manage.py runserver
```
5. **Access the app**
   
Open register.html on browser

## Stripe Integration

Stripe integration for payment processing is currently under development and will be available in a future update.

## In Progress

- Complete Stripe integration

- Improve UI with frontend frameworks (optional)
