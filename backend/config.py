import os
from dotenv import load_dotenv

load_dotenv()

JWT_TOKEN_LOCATION = ["cookies"]
JWT_COOKIE_SECURE = False
JWT_COOKIE_CSRF_PROTECT = False
class Config:

    SECRET_KEY = os.getenv("SECRET_KEY")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_CSRF_PROTECT = True