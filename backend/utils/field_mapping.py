# Measurement field mappings
MEASUREMENT_FRONTEND_TO_BACKEND = {
    'name': 'name',
    'gender': 'gender', 
    'notes': 'notes',
    'chest': 'chest',
    'waist': 'waist',
    'seat': 'seat',
    'shirtLength': 'shirtLength',
    'armLength': 'armLength', 
    'neck': 'neck',
    'hip': 'hip',
    'poloShirtLength': 'poloShirtLength',
    'shoulderWidth': 'shoulderWidth',
    'wrist': 'wrist',
    'biceps': 'biceps',
    'customerId': 'customer_id'
}

MEASUREMENT_BACKEND_TO_FRONTEND = {v: k for k, v in MEASUREMENT_FRONTEND_TO_BACKEND.items()}

# User profile field mappings
BUSINESS_PROFILE_FRONTEND_TO_BACKEND = {
    'legalEntityName': 'legal_entity_name',
    'gst': 'gst_number',
    'pan': 'pan_number',
    'address': 'address',
    'contactPersonName': 'contact_person_name',
    'contactNumber': 'contact_number',
    'email': 'email',
    'password': 'password',
    'logo': 'logo'
}

BUSINESS_PROFILE_BACKEND_TO_FRONTEND = {v: k for k, v in BUSINESS_PROFILE_FRONTEND_TO_BACKEND.items()}

INDIVIDUAL_PROFILE_FRONTEND_TO_BACKEND = {
    'name': 'name',
    'email': 'email',
    'contactNumber': 'contact_number',
    'address': 'address',
    'password': 'password'
}

INDIVIDUAL_PROFILE_BACKEND_TO_FRONTEND = {v: k for k, v in INDIVIDUAL_PROFILE_FRONTEND_TO_BACKEND.items()}

# Product field mappings
PRODUCT_FRONTEND_TO_BACKEND = {
    'name': 'name',
    'description': 'description',
    'price': 'price',
    'sellingPrice': 'selling_price',
    'images': 'images',
    'availableSizes': 'available_sizes',
    'specifications': 'specifications',
    'status': 'status',
    'rating': 'rating',
    'reviewCount': 'review_count',
    'createdAt': 'created_at',
    'updatedAt': 'updated_at'
}

PRODUCT_BACKEND_TO_FRONTEND = {v: k for k, v in PRODUCT_FRONTEND_TO_BACKEND.items()}

# Order field mappings
ORDER_FRONTEND_TO_BACKEND = {
    'items': 'items',
    'deliveryAddress': 'delivery_address',
    'measurementId': 'measurement_id',
    'totalAmount': 'total_amount',
    'status': 'status',
    'paymentMethod': 'payment_method',
    'paymentStatus': 'payment_status',
    'createdAt': 'created_at',
    'updatedAt': 'updated_at'
}

ORDER_BACKEND_TO_FRONTEND = {v: k for k, v in ORDER_FRONTEND_TO_BACKEND.items()}

ORDER_ITEM_FRONTEND_TO_BACKEND = {
    'productId': 'product_id',
    'productName': 'product_name',
    'quantity': 'quantity',
    'price': 'price',
    'size': 'size'
}

ORDER_ITEM_BACKEND_TO_FRONTEND = {v: k for k, v in ORDER_ITEM_FRONTEND_TO_BACKEND.items()}

def map_fields(data, mapping):
    """Map field names according to the provided mapping dictionary"""
    if not data:
        return data
    
    if isinstance(data, list):
        return [map_fields(item, mapping) for item in data]
    
    if isinstance(data, dict):
        mapped_data = {}
        for key, value in data.items():
            new_key = mapping.get(key, key)
            mapped_data[new_key] = value
        return mapped_data
    
    return data

def map_measurement_to_frontend(measurement_data):
    """Map measurement data from backend format to frontend format"""
    return map_fields(measurement_data, MEASUREMENT_BACKEND_TO_FRONTEND)

def map_measurement_to_backend(measurement_data):
    """Map measurement data from frontend format to backend format"""
    return map_fields(measurement_data, MEASUREMENT_FRONTEND_TO_BACKEND)

def map_product_to_frontend(product_data):
    """Map product data from backend format to frontend format"""
    return map_fields(product_data, PRODUCT_BACKEND_TO_FRONTEND)

def map_product_to_backend(product_data):
    """Map product data from frontend format to backend format"""
    return map_fields(product_data, PRODUCT_FRONTEND_TO_BACKEND)

def map_order_to_frontend(order_data):
    """Map order data from backend format to frontend format"""
    mapped_order = map_fields(order_data, ORDER_BACKEND_TO_FRONTEND)
    
    # Map order items if they exist
    if 'items' in mapped_order and mapped_order['items']:
        mapped_order['items'] = [
            map_fields(item, ORDER_ITEM_BACKEND_TO_FRONTEND) 
            for item in mapped_order['items']
        ]
    
    return mapped_order

def map_order_to_backend(order_data):
    """Map order data from frontend format to backend format"""
    mapped_order = map_fields(order_data, ORDER_FRONTEND_TO_BACKEND)
    
    # Map order items if they exist
    if 'items' in mapped_order and mapped_order['items']:
        mapped_order['items'] = [
            map_fields(item, ORDER_ITEM_FRONTEND_TO_BACKEND) 
            for item in mapped_order['items']
        ]
    
    return mapped_order

def map_business_profile_to_frontend(profile_data):
    """Map business profile data from backend format to frontend format"""
    return map_fields(profile_data, BUSINESS_PROFILE_BACKEND_TO_FRONTEND)

def map_business_profile_to_backend(profile_data):
    """Map business profile data from frontend format to backend format"""
    return map_fields(profile_data, BUSINESS_PROFILE_FRONTEND_TO_BACKEND)

def map_individual_profile_to_frontend(profile_data):
    """Map individual profile data from backend format to frontend format"""
    return map_fields(profile_data, INDIVIDUAL_PROFILE_BACKEND_TO_FRONTEND)

def map_individual_profile_to_backend(profile_data):
    """Map individual profile data from frontend format to backend format"""
    return map_fields(profile_data, INDIVIDUAL_PROFILE_FRONTEND_TO_BACKEND)
