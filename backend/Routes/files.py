import os
from flask import Blueprint, request, send_from_directory, jsonify
from flask_jwt_extended import jwt_required

from Utils.Decorators import scope_required


file_bp = Blueprint('file', __name__)

@file_bp.route("/files/<path:path>", methods=["GET"])
def get_static_file(path):
    """ Retrieves a static file from the server """
    return send_from_directory("files", path)


@file_bp.route("/upload", methods=["POST"])
@jwt_required()
@scope_required(["admin"])
def upload_file():
    """ Stores files to the server """
    if "file" not in request.files:
        return jsonify({'msg': "No file part in the request"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({'msg': "No selected file"}), 400

    upload_folder = "files/"
    file_path = os.path.join(upload_folder, file.filename)

    if os.path.exists(file_path):
        return jsonify({'msg': "File with the same name already exists"}), 409

    file.save(file_path)
    return jsonify({'msg': "File uploaded successfully"}), 200


@file_bp.route("/delete/<filename>", methods=["DELETE"])
@jwt_required()
@scope_required(["admin"])
def delete_file(filename):
    """ Removes a file from the server """
    file_path = os.path.join("files", filename)

    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({'msg': f"File {filename} removed successfully"}), 200
        else:
            return jsonify({'msg': f"File {filename} not found"}), 404
    except Exception as e:
        return jsonify({'msg': f"Error removing file: {str(e)}"}), 500