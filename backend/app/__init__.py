from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():

    app = Flask(__name__)
    CORS(
    app,
    supports_credentials=True,
    origins=[
        "https://chetnawelfaretrust.org",
        "https://www.chetnawelfaretrust.org",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ]
)

    app.config.from_object("config.Config")

    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from app.models import User
    from app.models import WorkLog
    from app.routes.auth import auth_bp
    from app.routes.intern import intern_bp
    from app.routes.application import application_bp
    from app.routes.alumni import alumni_bp
    from app.routes.certificate import certificate_bp
    

    app.register_blueprint(application_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(intern_bp)
    app.register_blueprint(alumni_bp)
    app.register_blueprint(certificate_bp)

    return app