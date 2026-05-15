#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
python populate_data.py
python add_more_fruits.py
python seed_advanced.py
