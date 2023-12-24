import bcrypt

class CryptoManager:
    """
    Methods for managing cryptographic requirements
    """
    @staticmethod
    def hash_password(password):
        """
        Hashes password with bcrypt
        """
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed

    @staticmethod
    def check_password(password: str, bcrypt_hash: str):
        """
        Validates a password
        """
        return bcrypt.checkpw(password.encode('utf-8'), bcrypt_hash)
