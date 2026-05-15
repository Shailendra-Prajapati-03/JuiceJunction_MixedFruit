#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt
<<<<<<< HEAD

python manage.py collectstatic --no-input
python manage.py migrate
=======
python manage.py collectstatic --no-input
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
