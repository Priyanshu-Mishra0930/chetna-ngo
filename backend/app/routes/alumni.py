from flask import Blueprint
from flask import jsonify

from app.models import User

alumni_bp = Blueprint(
    "alumni",
    __name__
)
@alumni_bp.route(
    "/alumni",
    methods=["GET"]
)
def get_alumni():

    alumni = User.query.filter_by(
        role="intern",
        status="completed"
    ).all()

    data = []

    for user in alumni:

        data.append({

    "id": user.id,

    "name": user.name,

    "college": user.college,

    "email": user.email,

    "phone": user.phone,

    "year": user.year,

    "date": user.join_date,

    "leave_date": user.leave_date,

    "total_hours": user.total_hours,

    "certificate_number":
    user.certificate_number,

    "certificate_generated":
    user.certificate_generated,

    "best_intern":
    user.best_intern

})

    return jsonify(data), 200