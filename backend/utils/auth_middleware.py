from functools import wraps
from flask import request, jsonify, g
import jwt
from config import Config
from utils.database import get_db_connection

def require_auth(allowed_user_types=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token or not token.startswith('Bearer '):
                return jsonify({
                    'success': False,
                    'message': 'Access token required',
                    'error': 'No valid token provided'
                }), 401
            
            try:
                token = token.split(' ')[1]
                payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
                
                connection = get_db_connection()
                cursor = connection.cursor()
                
                cursor.execute("SELECT * FROM users WHERE id = %s", (payload['user_id'],))
                current_user = cursor.fetchone()
                
                if not current_user:
                    return jsonify({
                        'success': False,
                        'message': 'Invalid token',
                        'error': 'User not found'
                    }), 401
                
                if current_user['status'] not in ['approved']:
                    return jsonify({
                        'success': False,
                        'message': 'Account not approved',
                        'error': 'Your account status does not allow access'
                    }), 403
                
                if allowed_user_types and current_user['user_type'] not in allowed_user_types:
                    return jsonify({
                        'success': False,
                        'message': 'Insufficient permissions',
                        'error': 'Access denied for this user type'
                    }), 403
                
                g.current_user = current_user
                connection.close()
                return f(*args, **kwargs)
                
            except jwt.ExpiredSignatureError:
                return jsonify({
                    'success': False,
                    'message': 'Token expired',
                    'error': 'Please login again'
                }), 401
            except jwt.InvalidTokenError:
                return jsonify({
                    'success': False,
                    'message': 'Invalid token',
                    'error': 'Token is malformed'
                }), 401
            except Exception as e:
                return jsonify({
                    'success': False,
                    'message': 'Authentication error',
                    'error': str(e)
                }), 500
                
        return decorated_function
    return decorator