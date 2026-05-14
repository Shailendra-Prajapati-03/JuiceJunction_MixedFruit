import random
import string
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def generate_otp(length=6):
    """Generate a secure 6-digit numeric OTP."""
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email(email, otp):
    """
    Send a professional branded HTML OTP email to the user.
    """
    subject = f'{otp} is your JuiceJunction verification code'
    from_email = settings.DEFAULT_FROM_EMAIL
    
    # HTML Context
    context = {
        'otp': otp,
        'company_name': 'JuiceJunction',
        'expiration_minutes': 5,
    }
    
    # Responsive HTML Template (inline for simplicity or use a template file)
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }}
            .header {{
                background-color: #f97316;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background-color: #ffffff;
                padding: 40px;
                border-radius: 0 0 10px 10px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            }}
            .otp-code {{
                font-size: 48px;
                font-weight: 900;
                color: #f97316;
                letter-spacing: 10px;
                margin: 30px 0;
                text-align: center;
            }}
            .footer {{
                text-align: center;
                font-size: 12px;
                color: #94a3b8;
                margin-top: 20px;
            }}
            .warning {{
                color: #ef4444;
                font-size: 14px;
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="color: white; margin: 0; letter-spacing: -1px;">JuiceJunction</h1>
            </div>
            <div class="content">
                <h2 style="color: #1e293b; margin-top: 0;">Verify Your Email</h2>
                <p style="color: #475569; line-height: 1.6;">Hello,</p>
                <p style="color: #475569; line-height: 1.6;">Use the verification code below to sign in to your JuiceJunction account. This code is valid for <b>5 minutes</b>.</p>
                
                <div class="otp-code">{otp}</div>
                
                <p class="warning">Security Warning: Never share this code with anyone. JuiceJunction employees will never ask for your OTP.</p>
                
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                
                <p style="color: #475569; line-height: 1.6;">Stay Fresh,<br>The JuiceJunction Team</p>
            </div>
            <div class="footer">
                &copy; 2026 JuiceJunction Inc. | Freshness Delivered.
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = strip_tags(html_content)
    
    try:
        msg = EmailMultiAlternatives(subject, text_content, from_email, [email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {email}: {str(e)}")
        return False
