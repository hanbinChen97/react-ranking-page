import os

basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'instance', 'my_db.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = 'dev'