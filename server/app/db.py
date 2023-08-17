from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
Base = db.Model
metadata = db.metadata
