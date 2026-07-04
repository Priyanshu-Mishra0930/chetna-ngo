from flask import Blueprint
from flask import request
from flask import jsonify
from flask_jwt_extended import create_access_token
from flask_jwt_extended import set_access_cookies
from flask_jwt_extended import unset_jwt_cookies
from app.models import User

auth_bp = Blueprint(
    "auth",
    __name__
)

@auth_bp.route(
    "/login",
    methods=["POST"]
)
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:

        return jsonify({
            "success": False,
            "message": "Email and password required"
        }), 400

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:

        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401

    if not user.check_password(password):

        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401
    if user.status != "active":

        return jsonify({
            "success": False,
            "message": "Account inactive"
        }), 403
    access_token = create_access_token(
    identity=str(user.id),
    additional_claims={
        "role": user.role
    }
)

    response = jsonify({

        "success": True,

        "message": "Login successful",

        "role": user.role,

        "user": {

            "id": user.id,
            "name": user.name,
            "email": user.email

        }

    })

    set_access_cookies(
        response,
        access_token
    )

    return response, 200
@auth_bp.route(
    "/logout",
    methods=["POST"]
)
def logout():

    response = jsonify({
        "success": True,
        "message": "Logged out"
    })

    unset_jwt_cookies(response)

    return response, 200