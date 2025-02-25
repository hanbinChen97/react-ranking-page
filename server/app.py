from flask import Flask, jsonify
from flask_cors import CORS
from database import db, User
import os

app = Flask(__name__)
app.config.from_object('config')

# 确保 instance 文件夹存在
if not os.path.exists('instance'):
    os.makedirs('instance')

CORS(app)
db.init_app(app)

@app.route('/api/users')
def get_users():
    users = User.query.all()
    return jsonify({
        'users': [{'id': user.id, 'username': user.username, 'balance': user.balance} for user in users]
    })

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # 这将创建所有表
    app.run(port=3001, debug=True)