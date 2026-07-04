from datetime import datetime
from flask import Blueprint
from flask import request
from flask import jsonify
import secrets
import string
from datetime import datetime
from app.models import User
def generate_certificate_number():

    chars = string.ascii_uppercase + string.digits

    year = str(datetime.now().year)[-2:]

    p1 = "".join(secrets.choice(chars) for _ in range(4))
    p2 = "".join(secrets.choice(chars) for _ in range(4))
    p3 = "".join(secrets.choice(chars) for _ in range(4))

    return f"CWT-{year}-{p1}-{p2}-{p3}"

certificate_bp = Blueprint(
    "certificate",
    __name__
)
@certificate_bp.route(
    "/verify-certificate",
    methods=["POST"]
)
def verify_certificate():

    data = request.get_json()

    certificate_number = data.get(
        "certificate_number"
    )

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