from flask import Flask, jsonify
from flask_cors import CORS
from database import db, User, Position_Dev, UserBalance
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
    
    # 在终端打印结果用于调试
    print(f"\n所有用户:")
    for user in users[-5:]:
        print(f"用户 ID: {user.user_id}, 用户名: {user.username}, 余额: {user.balance}")

    return jsonify({
        'users': [{
            'user_id': user.user_id,
            'username': user.username,
            'balance': user.balance
        } for user in users]
    })

@app.route('/api/user/<int:user_id>/balance_history')
def get_user_balance_history(user_id):
    # 获取用户的余额历史记录
    balance_history = UserBalance.query.filter_by(user_id=user_id).order_by(
        UserBalance.balance_update_timestamp.desc()
    ).all()
    
    result = [{
        'balance': record.balance,
        'update_time': record.balance_update_time,
        'timestamp': record.balance_update_timestamp
    } for record in balance_history]
    
    # 在终端打印结果用于调试
    print(f"\n用户 ID {user_id} 的余额历史记录:")
    for record in result[-5:]:
        print(f"余额: {record['balance']}, 更新时间: {record['update_time']}")
    
    return jsonify({
        'user_id': user_id,
        'balance_history': result
    })

@app.route('/api/user/<int:user_id>/positions')
def get_user_positions(user_id):
    # 获取最新的持仓记录
    position = Position_Dev.query.filter_by(user_id=user_id).order_by(Position_Dev.datetime.desc()).first()
    
    if position is None:
        return jsonify({
            'error': 'User positions not found'
        }), 404

    # 在终端打印结果用于调试
    print(f"\n用户 ID {user_id} 的持仓记录:")
    print(f"持仓时间: {position.datetime}")
    print(f"持仓信息: {position.positions_json}")
        
    return jsonify({
        'user_id': position.user_id,
        'username': position.username,
        'datetime': position.datetime,
        'positions': position.positions_json
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # 这将创建所有表
    app.run(port=3001, debug=True)