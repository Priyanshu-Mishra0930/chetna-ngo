from flask import Blueprint
from flask import request
from flask import jsonify
from flask_jwt_extended import create_access_token
from flask_jwt_extended import set_access_cookies
from flask_jwt_extended import unset_jwt_cookies
from app.models import User
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)
from app import db
auth_bp = Blueprint(
    "auth",
    __name__
)
def validate_password(password):

    if len(password) < 8:
        return False, "Password must be at least 8 characters."

    if not any(c.isupper() for c in password):
        return False, "Password must contain one uppercase letter."

    if not any(c.islower() for c in password):
        return False, "Password must contain one lowercase letter."

    if not any(c.isdigit() for c in password):
        return False, "Password must contain one number."

    return True, ""
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
    setup_required = (
        user.security_answer is None
    )

    response = jsonify({

        "success": True,

        "message": "Login successful",

        "setup_required": setup_required,

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
@auth_bp.route(
    "/setup-account",
    methods=["POST"]
)
@jwt_required()
def setup_account():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)
    if user.security_answer is not None:

        return jsonify({

            "success":False,

            "message":"Account already setup"

        }),400

    if not user:

        return jsonify({

            "success": False,

            "message": "User not found"

        }),404

    data = request.get_json()

    answer = data.get("answer")
    password = data.get("password")
    validate_password(password)
    confirm_password = data.get("confirm_password")

    if not answer or not password or not confirm_password:

        return jsonify({

            "success": False,

            "message":"All fields are required"

        }),400

    if password != confirm_password:

        return jsonify({

            "success":False,

            "message":"Passwords do not match"

        }),400

    user.security_answer = generate_password_hash(
        answer.strip().lower()
    )

    user.set_password(password)

    db.session.commit()

    return jsonify({

        "success":True,

        "message":"Account setup completed"

    }),200
@auth_bp.route(
    "/forgot-password",
    methods=["POST"]
)
def forgot_password():

    data = request.get_json()

    email = data.get("email")

    if not email:

        return jsonify({

            "success": False,

            "message": "Email is required"

        }), 400

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:

        return jsonify({

            "success": False,

            "message": "No account found with this email"

        }), 404

    if user.security_answer is None:

        return jsonify({

            "success": False,

            "message": "Please complete first-time account setup."

        }), 400

    return jsonify({

        "success": True,

        "question": "What is your mother's first name?"

    }), 200
@auth_bp.route(
    "/reset-password",
    methods=["POST"]
)
def reset_password():

    data = request.get_json()

    email = data.get("email")
    answer = data.get("answer")
    password = data.get("password")
    confirm_password = data.get("confirm_password")

    if not email or not answer or not password or not confirm_password:

        return jsonify({

            "success": False,

            "message": "All fields are required"

        }), 400

    if password != confirm_password:

        return jsonify({

            "success": False,

            "message": "Passwords do not match"

        }), 400

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:

        return jsonify({

            "success": False,

            "message": "User not found"

        }), 404

    if user.security_answer is None:

        return jsonify({

            "success": False,

            "message": "Account setup not completed"

        }), 403

    if not check_password_hash(

        user.security_answer,

        answer.strip().lower()

    ):

        return jsonify({

            "success": False,

            "message": "Incorrect security answer"

        }), 401

    user.set_password(password)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Password reset successfully"

    }), 200
def logout():

    response = jsonify({
        "success": True,
        "message": "Logged out"
    })

    unset_jwt_cookies(response)

    return response, 200