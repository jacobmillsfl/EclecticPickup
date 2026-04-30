import bcrypt

class CryptoManager:
    """
    Methods for managing cryptographic requirements
    """
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Bcrypt hash for storing in SQLite / SQLAlchemy String columns (always UTF-8 str).
        """
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
        return hashed.decode("utf-8") if isinstance(hashed, bytes) else str(hashed)

    @staticmethod
    def check_password(password: str, bcrypt_hash):
        """
        Validates a password against a bcrypt hash from the DB (str or bytes).
        """
        if bcrypt_hash is None:
            return False
        if isinstance(bcrypt_hash, str):
            bcrypt_hash = bcrypt_hash.encode("utf-8")
        elif not isinstance(bcrypt_hash, bytes):
            bcrypt_hash = bytes(bcrypt_hash)
        return bcrypt.checkpw(password.encode("utf-8"), bcrypt_hash)
