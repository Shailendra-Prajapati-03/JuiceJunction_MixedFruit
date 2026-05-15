#!/usr/bin/env bash
# exit on error
set -o errexit

# Run migrations on every start to ensure DB is ready
python manage.py migrate --noinput

# Seed data if it's empty (scripts are idempotent anyway)
python populate_data.py
python add_more_fruits.py
python seed_advanced.py

# Start Gunicorn
gunicorn juicejunction_backend.wsgi:application
