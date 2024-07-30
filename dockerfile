# Use the official Python image
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
ENV DJANGO_SETTINGS_MODULE=e.settings

# Expose port 8000
EXPOSE 8000

# Run gunicorn
CMD ["gunicorn", "e.wsgi:application", "--bind", "0.0.0.0:8000"]
