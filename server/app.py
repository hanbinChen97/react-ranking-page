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

@app.route('/api/balance_history')
def get_all_balance_history():
    # 获取所有用户的余额历史记录
    balance_history = UserBalance.query.filter(
        UserBalance.user_flag != 'INVALID'
    ).order_by(
        UserBalance.balance_update_timestamp.asc()  # 按时间正序排列
    ).all()
    
    result = [{
        'user_id': record.user_id,
        'username': record.username,
        'balance': record.balance,
        'update_time': record.balance_update_time,
        'timestamp': record.balance_update_timestamp
    } for record in balance_history]
    
    # 在终端打印调试信息
    print(f"\n获取到 {len(result)} 条余额历史记录")
    print("最后5条记录示例:")
    for record in result[-5:]:
        print(f"用户: {record['username']}, 余额: {record['balance']}, 时间: {record['update_time']}")
    
    return jsonify({
        'balance_history': result
    })

@app.route('/api/user/<int:user_id>/positions')
def get_user_positions(user_id):
    # 获取最新的持仓记录
    position = Position_Dev.query.filter(
        Position_Dev.user_id==user_id
    ).order_by(Position_Dev.datetime.desc()).first()
    
    if position is None:
        return jsonify({
            'error': 'User positions not found'
        }), 404

    return jsonify({
        'user_id': position.user_id,
        'username': position.username,
        'datetime': position.datetime,
        'positions': position.positions_json
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=3001, debug=True)