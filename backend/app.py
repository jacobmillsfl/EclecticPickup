from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from Utils.ConfigManager import ConfigManager
from Models.database import db

# Flask Migrate: Required imports
from Models.changelog import Changelog
from Models.user import User
from Models.event import Event
from Models.setting import Settings
from Models.bandimage import BandImage
from Models.bandmember import BandMember
from Models.bandvideo import BandVideo
from Models.sociallink import SocialLink
from Models.song import Song
# End Flask Migrate

from Routes.auth import auth_bp
from Routes.events import event_bp
from Routes.settings import setting_bp
from Routes.users import user_bp
from Routes.bandimages import bandimage_bp
from Routes.bandmembers import bandmember_bp
from Routes.bandvideos import bandvideo_bp
from Routes.sociallinks import sociallink_bp
from Routes.files import file_bp

# #####################
# Init
# #####################

app = Flask(__name__)
CORS(app)

# #####################
# Configurations
# #####################

config = ConfigManager.get_config()

db_path = "database.db"
# volume_path = "/home/appuser/app/instance/database.db"

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_TOKEN_LOCATION"] = ["headers", "query_string"]
app.config["JWT_SECRET_KEY"] = config.jwt_secret

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return identity

# #####################
# Routes
# #####################

app.register_blueprint(auth_bp)
app.register_blueprint(event_bp)
app.register_blueprint(setting_bp)
app.register_blueprint(user_bp)
app.register_blueprint(bandimage_bp)
app.register_blueprint(bandmember_bp)
app.register_blueprint(bandvideo_bp)
app.register_blueprint(sociallink_bp)
app.register_blueprint(file_bp)

@app.route("/")
def home():
    """
    Root endpoint
    """
    return "Eclectic Pickup Web API"


# WARNING: Comment this code when running in docker. Uncomment only for local dev without Docker.
if __name__ == "__main__":
   app.run(host="0.0.0.0", port=8081)
