from datetime import datetime

from app import db


class WorkLog(db.Model):

    __tablename__ = "work_logs"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    date = db.Column(
        db.Date,
        nullable=False
    )

    work_done = db.Column(
        db.Text,
        nullable=False
    )

    hours = db.Column(
        db.Integer,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )