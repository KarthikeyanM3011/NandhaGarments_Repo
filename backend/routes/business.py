from flask import Blueprint, request, jsonify, g
from utils.auth_middleware import require_auth
from models.measurement import Measurement
from models.order import Order
from models.product import Product
from utils.database import get_db_connection

business_bp = Blueprint('business', __name__)

@business_bp.route('/business/dashboard', methods=['GET'])
@require_auth(['business'])
def get_dashboard():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("SELECT COUNT(*) as count FROM measurements WHERE user_id = %s", (g.current_user['id'],))
        measurements_count = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM orders WHERE user_id = %s", (g.current_user['id'],))
        orders_count = cursor.fetchone()['count']
        
        cursor.execute("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE user_id = %s", (g.current_user['id'],))
        total_revenue = float(cursor.fetchone()['total'])
        
        cursor.execute("""
            SELECT o.id, oi.product_name, oi.quantity, o.status, o.total_amount as amount, o.created_at
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = %s
            ORDER BY o.created_at DESC
            LIMIT 5
        """, (g.current_user['id'],))
        recent_orders = cursor.fetchall()
        
        connection.close()
        
        return jsonify({
            'success': True,
            'data': {
                'measurements': measurements_count,
                'orders': orders_count,
                'totalRevenue': total_revenue,
                'recentOrders': recent_orders
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch dashboard data',
            'error': str(e)
        }), 500

@business_bp.route('/business/measurements', methods=['GET'])
@require_auth(['business'])
def get_measurements():
    try:
        measurements = Measurement.get_measurements_by_user(g.current_user['id'])
        return jsonify({
            'success': True,
            'data': measurements
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch measurements',
            'error': str(e)
        }), 500

@business_bp.route('/business/measurements', methods=['POST'])
@require_auth(['business'])
def create_measurement():
    try:
        data = request.get_json()
        required_fields = ['name', 'gender', 'chest', 'waist', 'seat', 'shirtLength', 'armLength', 'neck', 'hip', 'poloShirtLength', 'shoulderWidth', 'wrist', 'biceps']
        
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required',
                    'error': 'Missing required field'
                }), 400
        
        measurement_id = Measurement.create_measurement(g.current_user['id'], data)
        
        return jsonify({
            'success': True,
            'message': 'Measurement added successfully',
            'data': {'id': measurement_id}
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to create measurement',
            'error': str(e)
        }), 500

@business_bp.route('/business/measurements/<int:measurement_id>', methods=['PUT'])
@require_auth(['business'])
def update_measurement(measurement_id):
    try:
        data = request.get_json()
        success = Measurement.update_measurement(measurement_id, g.current_user['id'], data)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Measurement updated successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Measurement not found or access denied',
                'error': 'Invalid measurement ID'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to update measurement',
            'error': str(e)
        }), 500

@business_bp.route('/business/measurements/<int:measurement_id>', methods=['DELETE'])
@require_auth(['business'])
def delete_measurement(measurement_id):
    try:
        success = Measurement.delete_measurement(measurement_id, g.current_user['id'])
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Measurement deleted successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Measurement not found or access denied',
                'error': 'Invalid measurement ID'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to delete measurement',
            'error': str(e)
        }), 500

@business_bp.route('/business/orders', methods=['GET'])
@require_auth(['business'])
def get_orders():
    try:
        orders = Order.get_orders_by_user(g.current_user['id'])
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

@business_bp.route('/business/orders', methods=['POST'])
@require_auth(['business'])
def create_order():
    try:
        data = request.get_json()
        
        if not data.get('items') or not data.get('deliveryAddress'):
            return jsonify({
                'success': False,
                'message': 'Items and delivery address are required',
                'error': 'Missing required fields'
            }), 400
        
        connection = get_db_connection()
        cursor = connection.cursor()
        
        order_items = []
        for item in data['items']:
            cursor.execute("SELECT * FROM products WHERE id = %s", (item['productId'],))
            product = cursor.fetchone()
            
            if not product:
                return jsonify({
                    'success': False,
                    'message': f'Product not found: {item["productId"]}',
                    'error': 'Invalid product ID'
                }), 404
            
            order_items.append({
                'product_id': product['id'],
                'product_name': product['name'],
                'quantity': item['quantity'],
                'price': float(product['selling_price']),
                'size': item.get('size', 'N/A')
            })
        
        connection.close()
        
        order_id = Order.create_order(
            g.current_user['id'],
            order_items,
            data['deliveryAddress'],
            data.get('measurementId')
        )
        
        total_amount = sum(item['quantity'] * item['price'] for item in order_items)
        
        return jsonify({
            'success': True,
            'message': 'Order placed successfully',
            'data': {
                'orderId': order_id,
                'totalAmount': total_amount,
                'status': 'pending'
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to create order',
            'error': str(e)
        }), 500