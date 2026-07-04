from flask import Blueprint
from flask import jsonify
from datetime import date
from flask import request
from app import db
from app.models import WorkLog
from app.models import User
from flask_jwt_extended import jwt_required
from app.utils.permissions import can_access_user,admin_required


intern_bp = Blueprint(
    "interns",
    __name__
)

@intern_bp.route(
    "/interns/<int:user_id>",
    methods=["GET"]
)
@jwt_required()
def get_intern(user_id):
    if not can_access_user(user_id):

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "success": False,
            "message": "Intern not found"
        }), 404

    return jsonify({

        "success": True,

        "data": {

            "id": user.id,

            "name": user.name,

            "email": user.email,

            "phone": user.phone,

            "college": user.college,

            "course": user.course,

            "year": user.year,

            "status": user.status,

            "total_hours": user.total_hours,

            "certificate_generated":
            user.certificate_generated,

            "best_intern":
            user.best_intern,

            "certificate_approved":user.certificate_approved

        }

    }), 200

@intern_bp.route(
    "/interns/<int:user_id>/logs",
    methods=["GET"]
)
@jwt_required()
def get_intern_logs(user_id):
    if not can_access_user(user_id):

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    logs = WorkLog.query.filter_by(
        user_id=user_id
    ).order_by(
        WorkLog.date.desc()
    ).all()

    data = []

    for log in logs:

        data.append({

            "id": log.id,

            "date": log.date.strftime("%d %b %Y"),

            "work_done": log.work_done,

            "hours": log.hours

        })

    return jsonify({

        "success": True,

        "logs": data

    }), 200
@intern_bp.route(
    "/interns/<int:user_id>/logs",
    methods=["POST"]
)
@jwt_required()
def create_work_log(user_id):
    if not can_access_user(user_id):

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "success": False,
            "message": "Intern not found"
        }), 404

    data = request.get_json()

    work_done = data.get("work_done")
    hours = data.get("hours")

    if not work_done or not hours:

        return jsonify({
            "success": False,
            "message": "Work description and hours required"
        }), 400

    log = WorkLog(

        user_id=user_id,

        date=date.today(),

        work_done=work_done,

        hours=hours

    )

    db.session.add(log)

    user.total_hours += hours
    if user.total_hours >= 30 and not user.certificate_approved:
        user.certificate_approved = True

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Work log submitted"

    }), 201
@intern_bp.route(
    "/interns",
    methods=["GET"]
)
@jwt_required()
def get_interns():

    if not admin_required():

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    interns = User.query.filter_by(
        role="intern"
    ).all()

    data = []

    for intern in interns:

        data.append({

            "id": intern.id,

            "name": intern.name,

            "college": intern.college,

            "course": intern.course,

            "year": intern.year,

            "email": intern.email,

            "phone": intern.phone,

            "status": intern.status,

            "total_hours": intern.total_hours,

            "best_intern": intern.best_intern,
            "certificate_approved":
            intern.certificate_approved

        })

    return jsonify(data), 200
@intern_bp.route(
    "/interns/<int:user_id>/hours",
    methods=["PATCH"]
)
@jwt_required()
def adjust_hours(user_id):

    if not admin_required():

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "success": False,
            "message": "Intern not found"
        }), 404
    if user.role != "intern":

        return jsonify({
            "success": False,
            "message": "Only interns can be updated"
        }), 400

    data = request.get_json()
    hours = data.get("hours")

    if hours is None:

        return jsonify({
            "success": False,
            "message": "Hours required"
        }), 400
    
    if not isinstance(hours, int):

        return jsonify({
            "success": False,
            "message": "Hours must be an integer"
        }), 400

    if abs(hours) > 50:

        return jsonify({
            "success": False,
            "message": "Invalid adjustment"
        }), 400



    user.total_hours += hours

    if user.total_hours < 0:

        user.total_hours = 0

    db.session.commit()

    return jsonify({

        "success": True,

        "total_hours":
        user.total_hours

    }), 200
@intern_bp.route(
    "/interns/<int:user_id>/best-intern",
    methods=["PATCH"]
)
@jwt_required()
def toggle_best_intern(user_id):

    if not admin_required():

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "success": False,
            "message": "Intern not found"
        }), 404
    if user.status != "active":

        return jsonify({
            "success": False,
            "message": "Only active interns can be awarded"
        }), 400

    if user.role != "intern":

        return jsonify({
            "success": False,
            "message": "Only interns can be updated"
        }), 400

    user.best_intern = not user.best_intern

    db.session.commit()

    return jsonify({

        "success": True,

        "best_intern":
        user.best_intern,

        "message":
        "Best Intern status updated"

    }), 200
@intern_bp.route(
    "/interns/<int:user_id>/deactivate",
    methods=["PATCH"]
)
@jwt_required()
def toggle_intern_status(user_id):

    if not admin_required():

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "success": False,
            "message": "Intern not found"
        }), 404

    if user.role != "intern":

        return jsonify({
            "success": False,
            "message": "Only interns can be updated"
        }), 400

    if user.status == "active":

        user.status = "inactive"

    else:

        user.status = "active"

    db.session.commit()

    return jsonify({

        "success": True,

        "status": user.status,

        "message":
        "Intern status updated"

    }), 200

@intern_bp.route(
    "/interns/<int:user_id>/certificate-approval",
    methods=["PATCH"]
)
@jwt_required()
def toggle_certificate_approval(user_id):

    if not admin_required():

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "success": False,
            "message": "Intern not found"
        }), 404

    if user.role != "intern":

        return jsonify({
            "success": False,
            "message": "Only interns can be updated"
        }), 400

    user.certificate_approved = (
        not user.certificate_approved
    )

    db.session.commit()

    return jsonify({

        "success": True,

        "certificate_approved":
        user.certificate_approved,

        "message":
        "Certificate approval status updated"

    }), 200






























@intern_bp.route(
    "/interns/<int:user_id>/certificate",
    methods=["PATCH"]
)
@jwt_required()
def toggle_certificate(user_id):

    if not admin_required():

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "success": False,
            "message": "Intern not found"
        }), 404

    if user.role != "intern":

        return jsonify({
            "success": False,
            "message": "Only interns can be updated"
        }), 400

    user.certificate_generated = (
        not user.certificate_generated
    )

    db.session.commit()

    return jsonify({

        "success": True,

        "certificate_generated":
        user.certificate_generated,

        "message":
        "Certificate status updated"

    }), 200
@intern_bp.route(
    "/interns/<int:user_id>",
    methods=["PATCH"]
)
@jwt_required()
def update_intern(user_id):

    if not admin_required():

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "success": False,
            "message": "Intern not found"
        }), 404

    if user.role != "intern":

        return jsonify({
            "success": False,
            "message": "Only interns can be updated"
        }), 400

    data = request.get_json()

    user.name = data.get(
        "name",
        user.name
    )

    user.college = data.get(
        "college",
        user.college
    )

    user.course = data.get(
        "course",
        user.course
    )

    user.year = data.get(
        "year",
        user.year
    )

    user.email = data.get(
        "email",
        user.email
    )

    user.phone = data.get(
        "phone",
        user.phone
    )

    db.session.commit()

    return jsonify({

        "success": True,

        "message":
        "Intern updated successfully"

    }), 200