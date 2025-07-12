from utils.database import get_db_connection
from utils.field_mapping import map_order_to_frontend

class Order:
    @staticmethod
    def create_order(user_id, items, delivery_address, measurement_id=None):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        total_amount = sum(item['quantity'] * item['price'] for item in items)
        
        cursor.execute(
            "INSERT INTO orders (user_id, total_amount, delivery_address, measurement_id) VALUES (%s, %s, %s, %s)",
            (user_id, total_amount, delivery_address, measurement_id)
        )
        
        order_id = cursor.lastrowid
        
        for item in items:
            cursor.execute(
                "INSERT INTO order_items (order_id, product_id, product_name, quantity, price, size) VALUES (%s, %s, %s, %s, %s, %s)",
                (order_id, item['product_id'], item['product_name'], item['quantity'], item['price'], item['size'])
            )
        
        connection.close()
        return order_id
    
    @staticmethod
    def get_orders_by_user(user_id):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("SELECT * FROM orders WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        orders = cursor.fetchall()
        
        for order in orders:
            cursor.execute("SELECT * FROM order_items WHERE order_id = %s", (order['id'],))
            order['items'] = cursor.fetchall()
        
        connection.close()
        return [map_order_to_frontend(order) for order in orders]
    
    @staticmethod
    def get_all_orders():
        connection = get_db_connection()
        cursor = connection.cursor()
        
        query = """
        SELECT o.*, 
               CASE 
                   WHEN bp.contact_person_name IS NOT NULL THEN bp.contact_person_name
                   WHEN ip.name IS NOT NULL THEN ip.name
                   ELSE 'Unknown User'
               END as user_name,
               u.email as user_email,
               u.user_type
        FROM orders o
        JOIN users u ON o.user_id = u.id
        LEFT JOIN business_profiles bp ON u.id = bp.user_id
        LEFT JOIN individual_profiles ip ON u.id = ip.user_id
        ORDER BY o.created_at DESC
        """
        
        cursor.execute(query)
        orders = cursor.fetchall()
        
        for order in orders:
            cursor.execute("SELECT * FROM order_items WHERE order_id = %s", (order['id'],))
            order['items'] = cursor.fetchall()
        
        connection.close()
        return [map_order_to_frontend(order) for order in orders]
    
    @staticmethod
    def update_order_status(order_id, status):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("UPDATE orders SET status = %s WHERE id = %s", (status, order_id))
        connection.close()
        return cursor.rowcount > 0