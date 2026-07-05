from flask import Blueprint
from flask import request
from flask import jsonify

from app import db
from app.models import User
from app.utils.permissions import admin_required
from app.utils.permissions import super_admin_required

from datetime import date
import secrets
import string

from flask_jwt_extended import jwt_required


def generate_password():

    chars = (
        string.ascii_letters +
        string.digits
    )

    return "".join(
        secrets.choice(chars)
        for _ in range(10)
    )

application_bp = Blueprint(
    "applications",
    __name__
)

@application_bp.route(
    "/apply",
    methods=["POST"]
)
def apply():

    data = request.get_json()

    required_fields = [
        "name",
        "college",
        "course",
        "regnum",
        "year",
        "email",
        "phone",
        "why_join"
    ]

    for field in required_fields:

        if not data.get(field):

            return jsonify({
                "success": False,
                "message": f"{field} is required"
            }), 400

    existing_email = User.query.filter_by(
        email=data["email"]
    ).first()

    if existing_email:

        return jsonify({
            "success": False,
            "message": "Email already exists"
        }), 400

    existing_phone = User.query.filter_by(
        phone=data["phone"]
    ).first()

    if existing_phone:

        return jsonify({
            "success": False,
            "message": "Phone already exists"
        }), 400

    applicant = User(

        name=data["name"],

        college=data["college"],

        course=data["course"],
        
        regnum=data["regnum"],

        year=data["year"],

        email=data["email"],

        phone=data["phone"],

        why_join=data["why_join"],

        role="applicant",

        status="pending"
    )

    db.session.add(applicant)

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Application submitted successfully"
    }), 201
@application_bp.route(
    "/applications",
    methods=["GET"]
)
@jwt_required()
def get_applications():
    if not admin_required():

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    applicants = User.query.filter_by(
        status="pending"
    ).all()

    data = []

    for applicant in applicants:

        data.append({
            "id": applicant.id,
            "name": applicant.name,
            "college": applicant.college,
            "course": applicant.course,
            "year": applicant.year,
            "email": applicant.email,
            "phone": applicant.phone
        })

    return jsonify(data), 200
@application_bp.route(
    "/applications/<int:user_id>/approve",
    methods=["POST"]
)
@jwt_required()
def approve_application(user_id):
    if not admin_required():

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    applicant = User.query.get(user_id)

    if not applicant:

        return jsonify({
            "success": False,
            "message": "Applicant not found"
        }), 404

    if applicant.role != "applicant":

        return jsonify({
            "success": False,
            "message": "Only applicants can be approved"
        }), 400

    password = generate_password()

    applicant.set_password(password)

    applicant.role = "intern"

    applicant.status = "active"

    applicant.join_date = date.today()

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Applicant approved",

        "email": applicant.email,

        "password": password

    }), 200
@application_bp.route(
    "/applications/<int:user_id>/approve-admin",
    methods=["POST"]
)
@jwt_required()
def approve_admin(user_id):

    if not super_admin_required():

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    applicant = User.query.get(user_id)

    if not applicant:

        return jsonify({
            "success": False,
            "message": "Applicant not found"
        }), 404

    if applicant.role != "applicant":

        return jsonify({
            "success": False,
            "message": "Only applicants can be approved"
        }), 400

    password = generate_password()

    applicant.set_password(password)

    applicant.role = "admin"

    applicant.status = "active"

    applicant.join_date = date.today()

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Admin approved",

        "email": applicant.email,

        "password": password

    }), 200
@application_bp.route(
    "/applications/<int:user_id>/reject",
    methods=["POST"]
)
@jwt_required()
def reject_application(user_id):

    if not admin_required():

        return jsonify({
            "success": False,
            "message": "Access denied"
        }), 403

    applicant = User.query.get(user_id)

    if not applicant:

        return jsonify({
            "success": False,
            "message": "Applicant not found"
        }), 404

    if applicant.role != "applicant":

        return jsonify({
            "success": False,
            "message": "Only applicants can be rejected"
        }), 400

    db.session.delete(applicant)

    db.session.commit()

    return jsonify({

        "success": True,

        "message":
        "Application rejected"

    }), 200