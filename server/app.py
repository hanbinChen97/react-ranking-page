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
    # 查询用户，排除 flag 为 'invalid' 的用户
    users = User.query.filter(User.flag != 'INVALID').with_entities(
        User.user_id, User.username, User.balance
    ).all()
    
    return jsonify({
        'users': [{
            'user_id': user.user_id,
            'username': user.username,
            'balance': user.balance
        } for user in users]
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # 这将创建所有表
    app.run(port=3001, debug=True)