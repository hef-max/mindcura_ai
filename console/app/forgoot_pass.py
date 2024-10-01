from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import numpy as np


def send_verification_code(email):
    code = np.random.randint(100000, 999999)
    email = ""
    # verification_codes[email] = code  # Simpan kode ke database atau cache
    send_email(email, code)

def send_email(to_email, code):
    from_email = ""
    password = "your-email-password"
    subject = "Your Verification Code"
    body = f"Your verification code is: {code}"

    # Membuat pesan email
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        # Menghubungkan ke server SMTP Gmail
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(from_email, password)
        text = msg.as_string()
        server.sendmail(from_email, to_email, text)
        server.quit()
        print("Email sent successfully")
    except Exception as e:
        print(f"Failed to send email: {e}")

def verify_code(email, code):
    saved_code = ""
    # saved_code = verification_codes.get(email)  # Ambil kode dari database atau cache
    return saved_code == code