from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from Utils.ConfigManager import ConfigManager
from Models.database import db
from Models.user import User
from Models.event import Event

from Routes.auth import auth_bp
from Routes.events import event_bp

# #####################
# Init
# #####################

app = Flask(__name__)
CORS(app)

# #####################
# Configurations
# #####################

config = ConfigManager.get_config()

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_TOKEN_LOCATION"] = ["headers", "query_string"]
app.config["JWT_SECRET_KEY"] = config.jwt_secret

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# #####################
# Routes
# #####################

app.register_blueprint(auth_bp)
app.register_blueprint(event_bp)

@app.route("/")
def home():
    """
    Root endpoint
    """
    return "Eclectic Pickup Web API"

# WARNING: Comment this code when running in docker. Uncomment only for local dev without Docker.
if __name__ == "__main__":
   app.run(host="0.0.0.0", port=8081)
