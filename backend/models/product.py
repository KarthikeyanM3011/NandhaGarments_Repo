import json
from utils.database import get_db_connection
from utils.field_mapping import map_product_to_frontend

class Product:
    @staticmethod
    def create_product(data):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        query = """
        INSERT INTO products (name, description, price, selling_price, images, available_sizes, specifications)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        
        values = (
            data.get('name'), data.get('description'), data.get('price'),
            data.get('selling_price'), json.dumps(data.get('images', [])),
            json.dumps(data.get('available_sizes', [])), json.dumps(data.get('specifications', {}))
        )
        
        cursor.execute(query, values)
        product_id = cursor.lastrowid
        connection.close()
        return product_id
    
    @staticmethod
    def get_products(search=None, sort_by='created_at', sort_order='DESC', page=1, limit=12):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("SELECT * FROM products WHERE status = 'active'")
        all_products = cursor.fetchall()
        
        for product in all_products:
            if product['images']:
                product['images'] = json.loads(product['images'])
            if product['available_sizes']:
                product['available_sizes'] = json.loads(product['available_sizes'])
            if product['specifications']:
                product['specifications'] = json.loads(product['specifications'])
        
        filtered_products = all_products
        if search:
            search_lower = search.lower()
            filtered_products = [
                product for product in all_products 
                if (search_lower in product['name'].lower() if product['name'] else False) or 
                (search_lower in product['description'].lower() if product['description'] else False)
            ]
        
        sort_mapping = {
            'name_asc': ('name', False),
            'name_desc': ('name', True),
            'price_asc': ('selling_price', False),
            'price_desc': ('selling_price', True),
            'date_asc': ('created_at', False),
            'date_desc': ('created_at', True)
        }
        
        if sort_by in sort_mapping:
            sort_key, reverse = sort_mapping[sort_by]
            filtered_products.sort(key=lambda x: x[sort_key] if x[sort_key] is not None else '', reverse=reverse)
        else:
            filtered_products.sort(key=lambda x: x['created_at'] if x['created_at'] is not None else '', reverse=True)
        
        total_count = len(filtered_products)
        
        start_index = (page - 1) * limit
        end_index = start_index + limit
        paginated_products = filtered_products[start_index:end_index]
        
        connection.close()
        return [map_product_to_frontend(product) for product in paginated_products], total_count
        
    @staticmethod
    def get_product_by_id(product_id):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
        product = cursor.fetchone()
        
        if product:
            if product['images']:
                product['images'] = json.loads(product['images'])
            if product['available_sizes']:
                product['available_sizes'] = json.loads(product['available_sizes'])
            if product['specifications']:
                product['specifications'] = json.loads(product['specifications'])
            return map_product_to_frontend(product)
        
        connection.close()
        return None
    
    @staticmethod
    def update_product(product_id, data):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        query = """
        UPDATE products SET name = %s, description = %s, price = %s, selling_price = %s,
        images = %s, available_sizes = %s, specifications = %s WHERE id = %s
        """
        
        values = (
            data.get('name'), data.get('description'), data.get('price'),
            data.get('selling_price'), json.dumps(data.get('images', [])),
            json.dumps(data.get('available_sizes', [])), json.dumps(data.get('specifications', {})),
            product_id
        )
        
        cursor.execute(query, values)
        connection.close()
        return cursor.rowcount > 0
    
    @staticmethod
    def delete_product(product_id):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
        connection.close()
        return cursor.rowcount > 0