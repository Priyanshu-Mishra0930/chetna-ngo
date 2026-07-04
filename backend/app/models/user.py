from datetime import datetime
from app import db
from flask_bcrypt import generate_password_hash
from flask_bcrypt import check_password_hash


class User(db.Model):

    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    college = db.Column(
        db.String(150),
        nullable=False
    )

    course = db.Column(
        db.String(100),
        nullable=False
    )

    year = db.Column(
        db.Integer,
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    phone = db.Column(
        db.String(20),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255)
    )

    security_answer = db.Column(
        db.String(255),
        nullable=True
    )

    role = db.Column(
        db.String(20),
        default="applicant"
    )

    status = db.Column(
        db.String(20),
        default="pending"
    )

    why_join = db.Column(
        db.Text
    )

    join_date = db.Column(
        db.Date
    )

    leave_date = db.Column(
        db.Date
    )

    total_hours = db.Column(
        db.Integer,
        default=0
    )

    certificate_approved = db.Column(
        db.Boolean,
        default=False
    )

    certificate_generated = db.Column(
        db.Boolean,
        default=False
    )
    certificate_number = db.Column(
        db.String(50),
        unique=True,
        nullable=True 
    )

    best_intern = db.Column(
        db.Boolean,
        default=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.now
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now
    )
    work_logs = db.relationship(
        "WorkLog",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )
    def set_password(self, password):

        self.password_hash = generate_password_hash(
            password
        ).decode("utf-8")


    def check_password(self, password):

        return check_password_hash(
            self.password_hash,
            password
        )
