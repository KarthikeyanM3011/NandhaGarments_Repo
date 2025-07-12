from flask import Blueprint, request, jsonify
import bcrypt
import jwt
from datetime import datetime, timedelta
from config import Config
from models.user import User
from utils.database import get_db_connection
from utils.validators import validate_email, validate_gst, validate_pan, validate_phone

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth/superadmin/login', methods=['POST'])
def superadmin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({
            'success': False,
            'message': 'Email and password are required',
            'error': 'Missing credentials'
        }), 400
    
    user = User.get_user_by_email(email)
    if not user or user['user_type'] != 'superadmin':
        return jsonify({
            'success': False,
            'message': 'Invalid credentials',
            'error': 'Email or password is incorrect'
        }), 401
    
    if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({
            'success': False,
            'message': 'Invalid credentials',
            'error': 'Email or password is incorrect'
        }), 401
    
    token = jwt.encode({
        'user_id': user['id'],
        'email': user['email'],
        'user_type': user['user_type'],
        'exp': datetime.utcnow() + timedelta(hours=Config.JWT_ACCESS_TOKEN_EXPIRE_HOURS)
    }, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)
    
    return jsonify({
        'success': True,
        'message': 'Login successful',
        'data': {
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': 'Super Administrator',
                'type': user['user_type']
            }
        }
    })

@auth_bp.route('/auth/business/login', methods=['POST'])
def business_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({
            'success': False,
            'message': 'Email and password are required',
            'error': 'Missing credentials'
        }), 400
    
    user = User.get_user_by_email(email)
    if not user or user['user_type'] != 'business':
        return jsonify({
            'success': False,
            'message': 'Invalid credentials',
            'error': 'Email or password is incorrect'
        }), 401
    
    if user['status'] != 'approved':
        return jsonify({
            'success': False,
            'message': 'Account not approved',
            'error': 'Your account is pending approval from administrator'
        }), 403
    
    if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({
            'success': False,
            'message': 'Invalid credentials',
            'error': 'Email or password is incorrect'
        }), 401
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM business_profiles WHERE user_id = %s", (user['id'],))
    profile = cursor.fetchone()
    connection.close()
    
    token = jwt.encode({
        'user_id': user['id'],
        'email': user['email'],
        'user_type': user['user_type'],
        'exp': datetime.utcnow() + timedelta(hours=Config.JWT_ACCESS_TOKEN_EXPIRE_HOURS)
    }, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)
    
    return jsonify({
        'success': True,
        'message': 'Login successful',
        'data': {
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'companyName': profile['legal_entity_name'] if profile else '',
                'contactPersonName': profile['contact_person_name'] if profile else '',
                'type': user['user_type'],
                'status': user['status']
            }
        }
    })

@auth_bp.route('/auth/business/signup', methods=['POST'])
def business_signup():
    data = request.get_json()
    
    required_fields = ['legalEntityName', 'gst', 'pan', 'address', 'contactPersonName', 'contactNumber', 'email', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({
                'success': False,
                'message': f'{field} is required',
                'error': 'Missing required field'
            }), 400
    
    if not validate_email(data['email']):
        return jsonify({
            'success': False,
            'message': 'Invalid email format',
            'error': 'Please provide a valid email address'
        }), 400
    
    if not validate_gst(data['gst']):
        return jsonify({
            'success': False,
            'message': 'Invalid GST number format',
            'error': 'Please provide a valid GST number'
        }), 400
    
    if not validate_pan(data['pan']):
        return jsonify({
            'success': False,
            'message': 'Invalid PAN number format',
            'error': 'Please provide a valid PAN number'
        }), 400
    
    if not validate_phone(data['contactNumber']):
        return jsonify({
            'success': False,
            'message': 'Invalid phone number format',
            'error': 'Please provide a valid phone number'
        }), 400
    
    existing_user = User.get_user_by_email(data['email'])
    if existing_user:
        return jsonify({
            'success': False,
            'message': 'Email already exists',
            'error': 'User with this email already registered'
        }), 400
    
    password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt(rounds=Config.BCRYPT_ROUNDS))
    
    try:
        user_id = User.create_user(data['email'], password_hash.decode('utf-8'), 'business', 'pending')
        
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO business_profiles (user_id, legal_entity_name, gst_number, pan_number, address, contact_person_name, contact_number, logo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            (user_id, data['legalEntityName'], data['gst'], data['pan'], data['address'], data['contactPersonName'], data['contactNumber'], data.get('logo'))
        )
        connection.close()
        
        return jsonify({
            'success': True,
            'message': 'Registration request submitted successfully! Please wait for admin approval.',
            'data': {
                'userId': user_id,
                'status': 'pending'
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Registration failed',
            'error': str(e)
        }), 500

@auth_bp.route('/auth/individual/login', methods=['POST'])
def individual_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({
            'success': False,
            'message': 'Email and password are required',
            'error': 'Missing credentials'
        }), 400
    
    user = User.get_user_by_email(email)
    if not user or user['user_type'] != 'individual':
        return jsonify({
            'success': False,
            'message': 'Invalid credentials',
            'error': 'Email or password is incorrect'
        }), 401
    
    if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        print("Here in password")
        return jsonify({
            'success': False,
            'message': 'Invalid credentials',
            'error': 'Email or password is incorrect'
        }), 401
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM individual_profiles WHERE user_id = %s", (user['id'],))
    profile = cursor.fetchone()
    connection.close()
    
    token = jwt.encode({
        'user_id': user['id'],
        'email': user['email'],
        'user_type': user['user_type'],
        'exp': datetime.utcnow() + timedelta(hours=Config.JWT_ACCESS_TOKEN_EXPIRE_HOURS)
    }, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)
    
    return jsonify({
        'success': True,
        'message': 'Login successful',
        'data': {
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': profile['name'] if profile else '',
                'type': user['user_type']
            }
        }
    })

@auth_bp.route('/auth/individual/signup', methods=['POST'])
def individual_signup():
    data = request.get_json()
    
    required_fields = ['name', 'email', 'contactNumber', 'address', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({
                'success': False,
                'message': f'{field} is required',
                'error': 'Missing required field'
            }), 400
    
    if not validate_email(data['email']):
        return jsonify({
            'success': False,
            'message': 'Invalid email format',
            'error': 'Please provide a valid email address'
        }), 400
    
    if not validate_phone(data['contactNumber']):
        return jsonify({
            'success': False,
            'message': 'Invalid phone number format',
            'error': 'Please provide a valid phone number'
        }), 400
    
    existing_user = User.get_user_by_email(data['email'])
    if existing_user:
        return jsonify({
            'success': False,
            'message': 'Email already exists',
            'error': 'User with this email already registered'
        }), 400
    
    password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt(rounds=Config.BCRYPT_ROUNDS))
    
    try:
        user_id = User.create_user(data['email'], password_hash.decode('utf-8'), 'individual', 'approved')
        
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO individual_profiles (user_id, name, contact_number, address) VALUES (%s, %s, %s, %s)",
            (user_id, data['name'], data['contactNumber'], data['address'])
        )
        connection.close()
        
        return jsonify({
            'success': True,
            'message': 'Account created successfully! You can now log in.',
            'data': {
                'userId': user_id
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Registration failed',
            'error': str(e)
        }), 500