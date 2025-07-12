from utils.database import get_db_connection

class Measurement:
    @staticmethod
    def create_measurement(user_id, data):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        query = """
        INSERT INTO measurements (user_id, customer_id, name, gender, notes, chest, waist, seat, 
        shirtLength, armLength, neck, hip, poloShirtLength, shoulderWidth, wrist, biceps)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        values = (
            user_id, data.get('customer_id'), data.get('name'), data.get('gender'),
            data.get('notes'), data.get('chest'), data.get('waist'), data.get('seat'),
            data.get('shirtLength'), data.get('armLength'), data.get('neck'),
            data.get('hip'), data.get('poloShirtLength'), data.get('shoulderWidth'),
            data.get('wrist'), data.get('biceps')
        )
        
        cursor.execute(query, values)
        measurement_id = cursor.lastrowid
        connection.close()
        return measurement_id
    
    @staticmethod
    def get_measurements_by_user(user_id):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("SELECT * FROM measurements WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        measurements = cursor.fetchall()
        connection.close()
        return measurements
    
    @staticmethod
    def update_measurement(measurement_id, user_id, data):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        query = """
        UPDATE measurements SET customer_id = %s, name = %s, gender = %s, notes = %s,
        chest = %s, waist = %s, seat = %s, shirtLength = %s, armLength = %s,
        neck = %s, hip = %s, poloShirtLength = %s, shoulderWidth = %s,
        wrist = %s, biceps = %s WHERE id = %s AND user_id = %s
        """
        
        values = (
            data.get('customer_id'), data.get('name'), data.get('gender'),
            data.get('notes'), data.get('chest'), data.get('waist'), data.get('seat'),
            data.get('shirtLength'), data.get('armLength'), data.get('neck'),
            data.get('hip'), data.get('poloShirtLength'), data.get('shoulderWidth'),
            data.get('wrist'), data.get('biceps'), measurement_id, user_id
        )
        
        cursor.execute(query, values)
        connection.close()
        return cursor.rowcount > 0
    
    @staticmethod
    def delete_measurement(measurement_id, user_id):
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("DELETE FROM measurements WHERE id = %s AND user_id = %s", (measurement_id, user_id))
        connection.close()
        return cursor.rowcount > 0