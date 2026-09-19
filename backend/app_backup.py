from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "LandLens backend is running successfully",
        "status": "success"
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "LandLens API"
    })


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)