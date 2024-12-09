# Use Python 3.8.5 on Alpine Linux
FROM python:3.12-slim

# Set environment variables to prevent Python from writing .pyc files
# and to ensure stdout and stderr are unbuffered (helpful for Docker logs)
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install necessary build dependencies and basic tools

RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    build-essential \
    gcc \
    libffi-dev \
    libssl-dev \
    libpq-dev \
    postgresql-client \
    curl \
    bash \
    && pip install --no-cache-dir --upgrade pip setuptools wheel \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*





    
# Set the working directory
WORKDIR /app

# Copy requirements file and install dependencies
# Make sure you have a requirements.txt file with your project dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Command to run your application (customize as needed)
#CMD ["python", "your_app.py"]  # Change 'your_app.py' to your main script or entry point


# Run migrations during the container build process
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose the port
EXPOSE 8000

# Run Gunicorn to serve Django
CMD ["gunicorn", "torrent.wsgi:application", "--bind", "0.0.0.0:8000"]


# running gunicorn from conf
#gunicorn -c gunicorn.conf.py my_project.wsgi:application
