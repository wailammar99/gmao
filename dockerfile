# Dockerfile for Django
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Run migrations and start the Django server
CMD ["sh", "-c", "python -m  manage.py makemigrations && python -m manage migrate && python manage.py runserver "]
