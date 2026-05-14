import random
import string
import os
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def generate_otp(length=6):
    """Generate a secure 6-digit numeric OTP."""
    return ''.join(random.choices(string.digits, k=length))

import requests
import json

def send_otp_email(email, otp):
    """
    Send email via Brevo API (preferred on cloud) or SMTP (local fallback).
    """
    api_key = os.getenv('BREVO_API_KEY')
    
    if api_key:
        # Send via Brevo API (Works on Render)
        url = "https://api.brevo.com/v3/smtp/email"
        headers = {
            "accept": "application/json",
            "api-key": api_key,
            "content-type": "application/json"
        }
        payload = {
            "sender": {"name": "JuiceJunction", "email": "juicejunction.business@gmail.com"},
            "to": [{"email": email}],
            "subject": f"{otp} is your JuiceJunction verification code",
            "htmlContent": f"""
                <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                    <h2>Verify Your Email</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color: #f97316; font-size: 48px; letter-spacing: 5px;">{otp}</h1>
                    <p>Valid for 5 minutes. Never share this code.</p>
                </div>
            """
        }
        try:
            response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=10)
            if response.status_code in [201, 200]:
                return True
            logger.error(f"Brevo API Error: {response.text}")
        except Exception as e:
            logger.error(f"Brevo Exception: {str(e)}")
            
    # Fallback to SMTP (for local development)
    subject = f'{otp} is your JuiceJunction verification code'
    from_email = settings.DEFAULT_FROM_EMAIL
    text_content = f"Your OTP is {otp}"
    html_content = f"<h1>{otp}</h1>" # Simple fallback
    
    try:
        msg = EmailMultiAlternatives(subject, text_content, from_email, [email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        return True
    except Exception as e:
        logger.error(f"SMTP Fallback Error: {str(e)}")
        return False
