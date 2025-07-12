from flask import Blueprint, request, jsonify, g
from utils.auth_middleware import require_auth
from models.product import Product
from utils.database import get_db_connection
import math

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    try:
        search = request.args.get('search', '')
        sort_by = request.args.get('sort', 'date_desc')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 12))
        products, total_count = Product.get_products(search=search, sort_by=sort_by, page=page, limit=limit)
        total_pages = math.ceil(total_count / limit)
        
        return jsonify({
            'success': True,
            'data': {
                'products': products,
                'totalPages': total_pages,
                'currentPage': page,
                'totalProducts': total_count
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch products',
            'error': str(e)
        }), 500

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.get_product_by_id(product_id)
        
        if not product:
            return jsonify({
                'success': False,
                'message': 'Product not found',
                'error': 'Invalid product ID'
            }), 404
        
        return jsonify({
            'success': True,
            'data': product
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch product',
            'error': str(e)
        }), 500

@products_bp.route('/cart', methods=['GET'])
@require_auth(['business', 'individual'])
def get_cart():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        query = """
        SELECT ci.*, p.name as product_name, p.selling_price as price, p.images
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = %s
        ORDER BY ci.created_at DESC
        """
        
        cursor.execute(query, (g.current_user['id'],))
        cart_items = cursor.fetchall()
        
        mapped_cart_items = []
        for item in cart_items:
            mapped_item = {
                'id': item['id'],
                'productId': item['product_id'],
                'productName': item['product_name'],
                'quantity': item['quantity'],
                'price': item['price'],
                'size': item['size'],
                'createdAt': item['created_at'],
                'updatedAt': item['updated_at']
            }
            
            if item['images']:
                import json
                images = json.loads(item['images'])
                mapped_item['image'] = images[0] if images else None
            else:
                mapped_item['image'] = None
                
            mapped_cart_items.append(mapped_item)
        
        connection.close()
        
        return jsonify({
            'success': True,
            'data': mapped_cart_items
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch cart',
            'error': str(e)
        }), 500

@products_bp.route('/cart', methods=['POST'])
@require_auth(['business', 'individual'])
def add_to_cart():
    try:
        data = request.get_json()
        
        if not data.get('productId') or not data.get('quantity'):
            return jsonify({
                'success': False,
                'message': 'Product ID and quantity are required',
                'error': 'Missing required fields'
            }), 400
        
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("SELECT * FROM products WHERE id = %s", (data['productId'],))
        product = cursor.fetchone()
        
        if not product:
            connection.close()
            return jsonify({
                'success': False,
                'message': 'Product not found',
                'error': 'Invalid product ID'
            }), 404
        
        try:
            cursor.execute(
                "INSERT INTO cart_items (user_id, product_id, quantity, size) VALUES (%s, %s, %s, %s) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)",
                (g.current_user['id'], data['productId'], data['quantity'], data.get('size'))
            )
            cart_item_id = cursor.lastrowid
            
            connection.close()
            
            return jsonify({
                'success': True,
                'message': 'Item added to cart',
                'data': {'cartItemId': cart_item_id}
            }), 201
            
        except Exception as e:
            connection.close()
            return jsonify({
                'success': False,
                'message': 'Failed to add item to cart',
                'error': str(e)
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to add to cart',
            'error': str(e)
        }), 500

@products_bp.route('/cart/<int:cart_item_id>', methods=['DELETE'])
@require_auth(['business', 'individual'])
def remove_from_cart(cart_item_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("DELETE FROM cart_items WHERE id = %s AND user_id = %s", (cart_item_id, g.current_user['id']))
        
        if cursor.rowcount > 0:
            connection.close()
            return jsonify({
                'success': True,
                'message': 'Item removed from cart'
            })
        else:
            connection.close()
            return jsonify({
                'success': False,
                'message': 'Cart item not found',
                'error': 'Invalid cart item ID'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to remove item from cart',
            'error': str(e)
        }), 500