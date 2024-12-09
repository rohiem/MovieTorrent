#!/bin/bash

# Wait for the database to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Run migrations
python manage.py migrate

# Start the application
exec "$@"
