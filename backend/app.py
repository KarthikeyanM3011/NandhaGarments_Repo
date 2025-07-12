from flask import Flask
from flask_cors import CORS
from config import Config

from routes.auth import auth_bp
from routes.business import business_bp
from routes.individual import individual_bp
from routes.products import products_bp
from routes.superadmin import superadmin_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, origins=Config.CORS_ORIGINS.split(','), supports_credentials=True)

app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(business_bp, url_prefix='/api')
app.register_blueprint(individual_bp, url_prefix='/api')
app.register_blueprint(products_bp, url_prefix='/api')
app.register_blueprint(superadmin_bp, url_prefix='/api')

@app.route('/api/health', methods=['GET'])
def health_check():
    return {'success': True, 'message': 'NandhaGarments API is running'}

@app.errorhandler(404)
def not_found(error):
    return {'success': False, 'message': 'Endpoint not found', 'error': 'Route does not exist'}, 404

@app.errorhandler(500)
def internal_error(error):
    return {'success': False, 'message': 'Internal server error', 'error': 'Something went wrong'}, 500

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=Config.APP_PORT,
        debug=Config.APP_DEBUG
    )