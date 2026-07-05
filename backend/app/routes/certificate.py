from datetime import datetime,date
import qrcode

from io import BytesIO

from flask import Blueprint
from flask import jsonify
from flask import request
from flask import send_file
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

from flask_jwt_extended import jwt_required
import secrets
import string
from app import db
from app.models import User
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

FONT_PATH = BASE_DIR / "fonts" / "Cinzel-Bold.ttf"

pdfmetrics.registerFont(
    TTFont(
        "Cinzel",
        str(FONT_PATH)
    )
)


certificate_bp = Blueprint(
    "certificate",
    __name__
)

def generate_qr_code(url):

    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=2
    )

    qr.add_data(url)

    qr.make(fit=True)

    qr_image = qr.make_image(
        fill_color="black",
        back_color="white"
    )

    buffer = BytesIO()

    qr_image.save(
        buffer,
        format="PNG"
    )

    buffer.seek(0)

    return ImageReader(buffer)
def generate_certificate_number():

    chars = string.ascii_uppercase + string.digits

    year = str(datetime.now().year)[-2:]

    p1 = "".join(secrets.choice(chars) for _ in range(4))
    p2 = "".join(secrets.choice(chars) for _ in range(4))
    p3 = "".join(secrets.choice(chars) for _ in range(4))

    return f"CWT-{year}-{p1}-{p2}-{p3}"


@certificate_bp.route(
    "/verify-certificate",
    methods=["POST"]
)
def verify_certificate():

    data = request.get_json()

    certificate_number = data.get(
        "certificate_number"
    ).strip().upper()
    if not certificate_number:
        return jsonify({"valid": False, "message": "Certificate number required"}), 400

    user = User.query.filter_by(
        certificate_number=
        certificate_number
    ).first()

    if not user:

        return jsonify({

            "valid": False,

            "message":
            "Certificate not found"

        }), 404

    return jsonify({

        "valid": True,

        "name":
        user.name,

        "college":
        user.college,

        "certificate_number":
        user.certificate_number

    }), 200


@certificate_bp.route(
    "/interns/<int:user_id>/generate-certificate",
    methods=["POST"]
)
@jwt_required()
def generate_certificate(
    user_id
):

    user = User.query.get(
        user_id
    )

    if not user:

        return jsonify({

            "success": False,

            "message":
            "Intern not found"

        }), 404

    if not user.certificate_approved:

        return jsonify({

            "success": False,

            "message":
            "Certificate not approved"

        }), 400

    if not user.certificate_number:

        while True:
            certificate_number = generate_certificate_number()

            if not User.query.filter_by(certificate_number=certificate_number).first():
                break

        user.certificate_number = certificate_number

        db.session.commit()
    if not user.leave_date:
        user.leave_date = date.today()
        db.session.commit()

    template_path = (
    BASE_DIR
    / "static"
    / "certificates"
    / "intern_certificate.jpeg"
)

    try:

        buffer = BytesIO()

        pdf = canvas.Canvas(
            buffer,
            pagesize=(1448, 2048)
        )

        pdf.drawImage(

            ImageReader(
                str(template_path)
            ),

            0,
            0,

            width=1448,
            height=2048

        )
        

        pdf.setFont(
            "Cinzel",
            67
        )

        pdf.drawCentredString(

            724,
            1300,

            user.name.upper()

        )
        pdf.setFillColor(HexColor("#17367F"))
        pdf.setFont(
            "Helvetica",
            30
        )

        pdf.drawCentredString(
            495,
            590,
            user.college.upper()
        )
        issue_date = datetime.now().strftime(
            "%d %b %Y"
        )

        pdf.setFont(
            "Helvetica",
            30
        )

        pdf.drawCentredString(
            975,
            500,
            issue_date
        )
        pdf.setFont(
            "Helvetica",
            19
        )

        verify_url = (
    f"http://localhost:5500/verify.html?id={user.certificate_number}"
)
        qr = generate_qr_code(verify_url)

        pdf.drawImage(

            qr,

            335,
            200,

            width=170,
            height=170

        )
        pdf.setFont(
            "Helvetica",
            32
        )
        hours = str(user.total_hours)
        pdf.drawCentredString(
            460,
            500,
            hours
        )
        pdf.setFont(
            "Helvetica",
            32
        )
        hours1 = str(user.total_hours)
        pdf.drawCentredString(
            1017,
            1168,
            hours1
        )
        join_date = user.join_date.strftime(
            "%d %b %Y"
        )

        pdf.drawCentredString(
            910,
            1117,
            join_date
        )
        
        leave_date = user.leave_date.strftime(
            "%d %b %Y"
        )

        pdf.drawCentredString(
            1175,
            1117,
            leave_date
        )
        
        pdf.setFont(
            "Helvetica",
                30
        )
        pdf.drawCentredString(
            487,
            420,
            f"{join_date} To {leave_date}"
        )
        
        pdf.setFont(
            "Helvetica",
            26
        )

        pdf.drawCentredString(
            975,
            600,
            str(user.regnum)
        )
        
        id_number = user.certificate_number
        pdf.setFont(
            "Helvetica",
            26
        )

        pdf.drawCentredString(
            999,
            420,
            id_number
        )
        pdf.save()

        buffer.seek(0)
        user.certificate_generated = True

        user.status = "completed"
        user.leave_date = user.leave_date
        db.session.commit()

        return send_file(

            buffer,

            as_attachment=True,

            download_name=
            f"{user.name}_certificate.pdf",

            mimetype=
            "application/pdf"

        )

    except Exception as e:

        return jsonify({

            "success": False,

            "error":
            str(e)

        }), 500
@certificate_bp.route(
    "/interns/<int:user_id>/generate-best-certificate",
    methods=["POST"]
)
@jwt_required()
def generate_best_certificate(
    user_id
):

    user = User.query.get(
        user_id
    )

    if not user:

        return jsonify({

            "success": False,

            "message":
            "Intern not found"

        }), 404

    if not user.best_intern:

        return jsonify({

            "success": False,

            "message":
            "Not marked as Best Intern"

        }), 400

    if not user.certificate_number:

        while True:
            certificate_number = generate_certificate_number()

            if not User.query.filter_by(certificate_number=certificate_number).first():
                break

        user.certificate_number = certificate_number

        db.session.commit()

    template_path = (
    BASE_DIR
    / "static"
    / "certificates"
    / "best_intern_certificate.jpeg"
)

    try:

        buffer = BytesIO()

        pdf = canvas.Canvas(
            buffer,
            pagesize=(2048, 1447)
        )

        pdf.drawImage(

            ImageReader(
                str(template_path)
            ),

            0,
            0,

            width=2048,
            height=1447

        )

        pdf.setFont(
            "Helvetica-Bold",
            64
        )

        pdf.drawCentredString(

            1024,
            950,

            f"BEST INTERN AWARD {datetime.now().year}"

        )
        pdf.setFont(
            "Cinzel",
            64
        )

        pdf.drawCentredString(

            1024,
            755,

            user.name.upper()

        )

        pdf.setFont(
            "Helvetica-Bold",
            34
        )

        pdf.drawCentredString(

            1024,
            680,

            user.college.upper()

        )
        pdf.setFont(
            "Helvetica",
            24
        )

        pdf.drawCentredString(

            270,
            125,

            user.certificate_number

        )

        issue_date = datetime.now().strftime(
            "%d %b %Y"
        )

        pdf.setFont(
            "Helvetica",
            22
        )

        pdf.drawCentredString(

            600,
            125,

            issue_date

        )

        pdf.drawCentredString(

            890,
            125,

            str(user.regnum)

        )
        verify_url = (
    f"http://localhost:5500/verify.html?id={user.certificate_number}"
)
        qr = generate_qr_code(verify_url)

        pdf.drawImage(

            qr,

            1100,
            125,

            width=160,
            height=160

        )
        pdf.save()

        buffer.seek(0)
        user.certificate_generated = True
        db.session.commit()

        return send_file(

            buffer,

            as_attachment=True,

            download_name=
            f"{user.name}_best_intern_certificate.pdf",

            mimetype=
            "application/pdf"

        )

    except Exception as e:

        return jsonify({

            "success": False,

            "error":
            str(e)

        }), 500