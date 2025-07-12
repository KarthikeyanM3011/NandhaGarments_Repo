from flask import Blueprint, request, jsonify, g
from utils.auth_middleware import require_auth
from models.user import User
from models.product import Product
from models.order import Order
from utils.database import get_db_connection
from utils.field_mapping import map_business_profile_to_frontend, map_individual_profile_to_frontend

superadmin_bp = Blueprint('superadmin', __name__)

@superadmin_bp.route('/superadmin/dashboard', methods=['GET'])
@require_auth(['superadmin'])
def get_dashboard():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("SELECT COUNT(*) as count FROM users WHERE user_type = 'business'")
        business_count = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM users WHERE user_type = 'individual'")
        individual_count = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM products WHERE status = 'active'")
        products_count = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM orders")
        orders_count = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM users WHERE status = 'pending'")
        pending_approvals = cursor.fetchone()['count']
        
        cursor.execute("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders")
        revenue = float(cursor.fetchone()['total'])
        
        cursor.execute("""
            SELECT o.id, 
                   CASE 
                       WHEN bp.contact_person_name IS NOT NULL THEN bp.contact_person_name
                       WHEN ip.name IS NOT NULL THEN ip.name
                       ELSE 'Unknown User'
                   END as user_name,
                   u.user_type, o.total_amount, o.status, o.created_at
            FROM orders o
            JOIN users u ON o.user_id = u.id
            LEFT JOIN business_profiles bp ON u.id = bp.user_id
            LEFT JOIN individual_profiles ip ON u.id = ip.user_id
            ORDER BY o.created_at DESC
            LIMIT 5
        """)
        recent_orders = cursor.fetchall()
        
        connection.close()
        
        return jsonify({
            'success': True,
            'data': {
                'totalBusinessUsers': business_count,
                'totalIndividualUsers': individual_count,
                'totalProducts': products_count,
                'totalOrders': orders_count,
                'pendingApprovals': pending_approvals,
                'revenue': revenue,
                'recentOrders': recent_orders
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch dashboard data',
            'error': str(e)
        }), 500

@superadmin_bp.route('/superadmin/users/business', methods=['GET'])
@require_auth(['superadmin'])
def get_business_users():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        query = """
        SELECT u.id, u.email, u.status, u.created_at,
               bp.legal_entity_name, bp.contact_person_name, bp.contact_number,
               bp.gst_number, bp.pan_number, bp.address, bp.logo
        FROM users u
        LEFT JOIN business_profiles bp ON u.id = bp.user_id
        WHERE u.user_type = 'business'
        ORDER BY u.created_at DESC
        """
        
        cursor.execute(query)
        users = cursor.fetchall()
        connection.close()
        
        mapped_users = []
        for user in users:
            mapped_user = {
                'id': user['id'],
                'email': user['email'],
                'status': user['status'],
                'createdAt': user['created_at']
            }
            if user['legal_entity_name']:
                profile_data = {
                    'legal_entity_name': user['legal_entity_name'],
                    'contact_person_name': user['contact_person_name'],
                    'contact_number': user['contact_number'],
                    'gst_number': user['gst_number'],
                    'pan_number': user['pan_number'],
                    'address': user['address'],
                    'logo': user['logo']
                }
                mapped_profile = map_business_profile_to_frontend(profile_data)
                mapped_user.update(mapped_profile)
            mapped_users.append(mapped_user)
        
        return jsonify({
            'success': True,
            'data': mapped_users
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch business users',
            'error': str(e)
        }), 500

@superadmin_bp.route('/superadmin/users/individual', methods=['GET'])
@require_auth(['superadmin'])
def get_individual_users():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        query = """
        SELECT u.id, u.email, u.status, u.created_at,
               ip.name, ip.contact_number, ip.address
        FROM users u
        LEFT JOIN individual_profiles ip ON u.id = ip.user_id
        WHERE u.user_type = 'individual'
        ORDER BY u.created_at DESC
        """
        
        cursor.execute(query)
        users = cursor.fetchall()
        connection.close()
        
        mapped_users = []
        for user in users:
            mapped_user = {
                'id': user['id'],
                'email': user['email'],
                'status': user['status'],
                'createdAt': user['created_at']
            }
            if user['name']:
                profile_data = {
                    'name': user['name'],
                    'contact_number': user['contact_number'],
                    'address': user['address']
                }
                mapped_profile = map_individual_profile_to_frontend(profile_data)
                mapped_user.update(mapped_profile)
            mapped_users.append(mapped_user)
        
        return jsonify({
            'success': True,
            'data': mapped_users
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch individual users',
            'error': str(e)
        }), 500

@superadmin_bp.route('/superadmin/users/<int:user_id>/approve', methods=['PUT'])
@require_auth(['superadmin'])
def approve_user(user_id):
    try:
        success = User.update_user_status(user_id, 'approved')
        
        if success:
            return jsonify({
                'success': True,
                'message': 'User approved successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'User not found',
                'error': 'Invalid user ID'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to approve user',
            'error': str(e)
        }), 500

@superadmin_bp.route('/superadmin/users/<int:user_id>/block', methods=['PUT'])
@require_auth(['superadmin'])
def block_user(user_id):
    try:
        success = User.update_user_status(user_id, 'blocked')
        
        if success:
            return jsonify({
                'success': True,
                'message': 'User blocked successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'User not found',
                'error': 'Invalid user ID'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to block user',
            'error': str(e)
        }), 500

@superadmin_bp.route('/superadmin/users/<int:user_id>/unblock', methods=['PUT'])
@require_auth(['superadmin'])
def unblock_user(user_id):
    try:
        success = User.update_user_status(user_id, 'approved')
        
        if success:
            return jsonify({
                'success': True,
                'message': 'User unblocked successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'User not found',
                'error': 'Invalid user ID'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to unblock user',
            'error': str(e)
        }), 500

@superadmin_bp.route('/superadmin/products', methods=['GET'])
@require_auth(['superadmin'])
def get_all_products():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        # Remove ORDER BY to avoid sorting large datasets
        cursor.execute("SELECT * FROM products LIMIT 100")  # Limit to prevent memory issues
        products = cursor.fetchall()
        
        for product in products:
            if product['images']:
                import json
                product['images'] = json.loads(product['images'])
            if product['available_sizes']:
                import json
                product['available_sizes'] = json.loads(product['available_sizes'])
            if product['specifications']:
                import json
                product['specifications'] = json.loads(product['specifications'])
        
        connection.close()
        
        return jsonify({
            'success': True,
            'data': products
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch products',
            'error': str(e)
        }), 500
        
@superadmin_bp.route('/superadmin/products', methods=['POST'])
@require_auth(['superadmin'])
def create_product():
    try:
        data = request.get_json()
        
        required_fields = ['name', 'description', 'price', 'sellingPrice']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required',
                    'error': 'Missing required field'
                }), 400
        
        product_data = {
            'name': data['name'],
            'description': data['description'],
            'price': data['price'],
            'selling_price': data['sellingPrice'],
            'images': data.get('images', []),
            'available_sizes': data.get('availableSizes', []),
            'specifications': data.get('specifications', {})
        }
        
        product_id = Product.create_product(product_data)
        
        return jsonify({
            'success': True,
            'message': 'Product added successfully',
            'data': {'productId': product_id}
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to create product',
            'error': str(e)
        }), 500

@superadmin_bp.route('/superadmin/products/<int:product_id>', methods=['PUT'])
@require_auth(['superadmin'])
def update_product(product_id):
    try:
        data = request.get_json()
        
        product_data = {}
        if 'name' in data:
            product_data['name'] = data['name']
        if 'description' in data:
            product_data['description'] = data['description']
        if 'price' in data:
            product_data['price'] = data['price']
        if 'sellingPrice' in data:
            product_data['selling_price'] = data['sellingPrice']
        if 'images' in data:
            product_data['images'] = data['images']
        if 'availableSizes' in data:
            product_data['available_sizes'] = data['availableSizes']
        if 'specifications' in data:
            product_data['specifications'] = data['specifications']
        
        success = Product.update_product(product_id, product_data)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Product updated successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Product not found',
                'error': 'Invalid product ID'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to update product',
            'error': str(e)
        }), 500

@superadmin_bp.route('/superadmin/products/<int:product_id>', methods=['DELETE'])
@require_auth(['superadmin'])
def delete_product(product_id):
    try:
        success = Product.delete_product(product_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Product deleted successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Product not found',
                'error': 'Invalid product ID'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to delete product',
            'error': str(e)
        }), 500

@superadmin_bp.route('/superadmin/orders', methods=['GET'])
@require_auth(['superadmin'])
def get_all_orders():
    try:
        orders = Order.get_all_orders()
        
        return jsonify({
            'success': True,
            'data': orders
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch orders',
            'error': str(e)
        }), 500

@superadmin_bp.route('/superadmin/orders/<int:order_id>/status', methods=['PUT'])
@require_auth(['superadmin'])
def update_order_status(order_id):
    try:
        data = request.get_json()
        status = data.get('status')
        
        if not status:
            return jsonify({
                'success': False,
                'message': 'Status is required',
                'error': 'Missing status field'
            }), 400
        
        valid_statuses = ['pending', 'confirmed', 'in_progress', 'ready', 'delivered', 'cancelled']
        if status not in valid_statuses:
            return jsonify({
                'success': False,
                'message': 'Invalid status',
                'error': f'Status must be one of: {", ".join(valid_statuses)}'
            }), 400
        
        success = Order.update_order_status(order_id, status)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Order status updated successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Order not found',
                'error': 'Invalid order ID'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to update order status',
            'error': str(e)
        }), 500
