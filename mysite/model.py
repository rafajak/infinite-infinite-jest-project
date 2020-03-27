from flask_app import db
from flask_sqlalchemy import SQLAlchemy
from config import Config


class Sequence(db.Model):

    __tablename__ = "sequences"
    __table_args__ = {'extend_existing': True} 
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(65535))
