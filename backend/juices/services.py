import random
import string
from django.core.mail import send_mail
from django.conf import settings
from twilio.rest import Client
import logging

logger = logging.getLogger(__name__)

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_email_otp(email, otp):
    """Send OTP via configured SMTP server."""
    subject = f'{otp} is your JuiceJunction Verification Code'
    message = f'''
    Hello,

    Your OTP for JuiceJunction login is: {otp}

    This code will expire in 5 minutes. If you did not request this, please ignore this email.

    Stay Fresh,
    The JuiceJunction Team
    '''
    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        logger.error(f"Failed to send email OTP: {str(e)}")
        return False

def send_sms_otp(phone_number, otp):
    """Send OTP via Twilio SMS API."""
    try:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=f"Your JuiceJunction verification code is: {otp}. Valid for 5 minutes.",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        return True
    except Exception as e:
        logger.error(f"Failed to send SMS OTP: {str(e)}")
        # In development, we might want to log the OTP if SMS fails
        if settings.DEBUG:
            print(f"DEBUG: SMS OTP for {phone_number} is {otp}")
        return False
