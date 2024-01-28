import os
from dotenv import dotenv_values

class ConfigManager:
    _instance = None
    config_values = ["FLASK_API_BASE_URL", "JWT_SECRET_KEY"]
    config = {}

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(ConfigManager, cls).__new__(cls)
            cls._instance.load_config()
        return cls._instance

    def load_config(self):
        missing_values = []
        for setting in self.config_values:
            value = os.environ.get(setting)
            if value:
                self.config[setting] = value
            else:
                missing_values.append(setting)

        # Check for missing environment variables
        if len(missing_values) > 0:
            print("Missing environment variables... Loading from dotenv file...")
            # Load values from a .env file using dotenv
            dotenv_config = dotenv_values(".backend.env")
            for setting in missing_values:
                value = dotenv_config.get(setting)
                if value:
                    self.config[setting] = value

    @staticmethod
    def get_config():
        return Config(ConfigManager()._instance.config)

class Config:
    def __init__(self, config_dict):
        self.config = config_dict

    @property
    def flask_api_base_url(self):
        return self.config.get("FLASK_API_BASE_URL")

    @property
    def jwt_secret(self):
        return self.config.get("JWT_SECRET_KEY")
    
    # Add more properties/methods for other configuration values as needed
