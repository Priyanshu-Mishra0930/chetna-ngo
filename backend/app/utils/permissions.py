from flask_jwt_extended import get_jwt
from flask_jwt_extended import get_jwt_identity

def admin_required():

    claims = get_jwt()

    role = claims.get("role")

    return role in [
        "admin",
        "super_admin"
    ]


def super_admin_required():

    claims = get_jwt()

    role = claims.get("role")

    return role == "super_admin"
def can_access_user(user_id):

    claims = get_jwt()

    role = claims.get("role")

    current_user_id = int(
        get_jwt_identity()
    )

    if role in [
        "admin",
        "super_admin"
    ]:
        return True

    return current_user_id == user_id