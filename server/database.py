from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    balance = db.Column(db.Float, default=0.0)
    flag = db.Column(db.String(20))

class UserBalance(db.Model):
    __tablename__ = 'users_balance'
    user_balance_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(80), nullable=False)
    balance = db.Column(db.Float)
    balance_update_time = db.Column(db.String(80))
    balance_update_timestamp = db.Column(db.Integer)

class Position_Dev(db.Model):
    __tablename__ = 'positions_dev'
    positions_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(80), nullable=False)
    datetime = db.Column(db.String(80))
    positions_json = db.Column(db.Text)