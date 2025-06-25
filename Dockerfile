FROM python:3.11-slim 

WORKDIR /code

COPY requirements.txt .

RUN pip install -r requirements.txt

# Copy only backend project files
COPY manage.py .
COPY ecommerce/ ./ecommerce/
COPY store/ ./store/

CMD sh -c "python manage.py makemigrations && python manage.py migrate && gunicorn ecommerce.wsgi:application --bind 0.0.0.0:8000"