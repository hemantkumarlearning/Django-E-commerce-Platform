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
   git clone https://github.com/hemantkumarlearning/Django-E-commerce-Platform.git
   cd Django-E-commerce-Platform
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

Access via UI → Redirects to register.html (or the registration page) in frontend/templates/register.html

Access via API → Redirects to Swagger docs (API documentation)

##  Admin Access

This project uses Django's built-in `is_staff` flag to manage admin roles.

> **Note:** To grant a user admin privileges, you need to manually update the user record in the database by setting the `is_staff` field to `True`.

You can do this via:

- **Django Admin Panel** (if enabled):  
  Log in as a superuser, find the user, and toggle **Staff status**.

- **Django shell:**

Run the following commands:
```
python manage.py shell
```

Then in the shell:

from django.contrib.auth.models import User
user = User.objects.get(username='username_here')
user.is_staff = True
user.save()

## Stripe Integration

Stripe integration for payment processing is currently under development and will be available in a future update.

## In Progress

- Complete Stripe integration

- Improve UI with frontend frameworks (optional)
