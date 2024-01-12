from flask import Blueprint, request, send_from_directory, jsonify
from flask_jwt_extended import jwt_required

from Utils.Decorators import scope_required


file_bp = Blueprint('file', __name__)

@file_bp.route("/files/<path:path>", methods=["GET"])
def get_static_file(path):
    """ Retrieves a static file from the server """
    return send_from_directory("files", path)

@jwt_required()
@scope_required(["admin"])
@file_bp.route("/upload", methods=["POST"])
def upload_file():
    """ Stores files to the server """
    if "file" not in request.files:
        return jsonify({"message": "No file part in the request"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    file.save("files/" + file.filename)
    return jsonify({"message": "File uploaded successfully"}), 200
