from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from reportlab.lib.pagesizes import letter
from flask_login import current_user
from datetime import datetime
from flask import current_app, make_response
from .models import ConsultationHistory
from io import BytesIO
from .gpt import get_dsm_explanation
from werkzeug.utils import secure_filename
from .aws_s3 import s3_client, S3_BUCKET_NAME  # Make sure to import your S3 client and bucket name

def hitung_usia(tanggal_lahir):
    tanggal_lahir = f'{tanggal_lahir}'
    tanggal_lahir = datetime.strptime(tanggal_lahir, "%Y-%m-%d %H:%M:%S")
    tanggal_hari_ini = datetime.today()
    usia = tanggal_hari_ini.year - tanggal_lahir.year
    if (tanggal_hari_ini.month, tanggal_hari_ini.day) < (tanggal_lahir.month, tanggal_lahir.day):
        usia -= 1
    return usia

def generate_pdf(consultation_id):
    consultation = ConsultationHistory.query.filter_by(id=consultation_id).first()
    if not consultation:
        return None  # Handle the case where consultation is not found
    
    pdf_buffer = BytesIO()  # Create a BytesIO buffer to hold the PDF data

    document = SimpleDocTemplate(pdf_buffer, pagesize=letter)  # Pass the buffer instead of a filename
    styles = getSampleStyleSheet()
    
    title_style = styles['Heading1']
    subtitle_style = styles['Heading2']
    normal_style = styles['BodyText']
    custom_style = ParagraphStyle(
        name='Custom',
        parent=normal_style,
        fontName='Helvetica',
        fontSize=12,
        leading=14,
        spaceAfter=10,
    )
    
    content = []

    # Document Content
    content.append(Paragraph("Asesmen Klinis", title_style))
    content.append(Spacer(1, 12))
    
    content.append(Paragraph("Identitas Subjek", subtitle_style))
    content.append(Spacer(1, 12))
    content.append(Paragraph(f"Nama: {current_user.username}", custom_style))
    content.append(Paragraph(f"Usia: {hitung_usia(current_user.birth)}", custom_style))
    content.append(Paragraph(f"Jenis Kelamin: {current_user.jeniskelamin}", custom_style))
    content.append(Paragraph(f"Pendidikan: {current_user.univ}", custom_style))
    content.append(Paragraph(f"Pekerjaan: {current_user.status}", custom_style))
    content.append(Paragraph(f"Anak ke: {current_user.anakke}", custom_style))
    content.append(Spacer(1, 12))
    
    content.append(Paragraph("Hasil DASS-21:", subtitle_style))
    content.append(Paragraph(f"{consultation.resdass} {consultation.resdsm}", custom_style))
    content.append(Spacer(1, 12))

    content.append(Paragraph("Hasil Wawancara", subtitle_style))
    content.append(Spacer(1, 12))
    content.append(Paragraph(f"Kesimpulan: {get_dsm_explanation()}", custom_style))

    document.build(content)  # Build the PDF

    pdf_buffer.seek(0)  # Rewind the buffer to the beginning
    
    try:
        # Upload the PDF file directly to S3 without saving locally
        s3_client.upload_fileobj(
            pdf_buffer, 
            S3_BUCKET_NAME, 
            secure_filename(f'consultation_{consultation_id}.pdf'),  # Use a valid key
            ExtraArgs={'ContentType': 'application/pdf'}
        )
        
        # Return a response indicating success or providing a download link
        return f'consultation_{consultation_id}.pdf'  # Return the filename or S3 key for further handling
    
    except Exception as e:
        current_app.logger.error(f"Error uploading PDF to S3: {e}")
        return f"Error uploading PDF to S3: {str(e)}"
