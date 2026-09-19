from flask import Flask, jsonify, request
from flask_cors import CORS
import pytesseract
from PIL import Image

# Tell pytesseract exactly where Tesseract is installed
pytesseract.pytesseract.tesseract_cmd = (
    r"D:\Program Files\Tesseract-OCR\tesseract.exe"
)


def extract_value_from_line(lines, index):
    """
    Extract a value from the same line after ':'.
    If no value exists after ':', try the next line.
    """

    line = lines[index]

    if ":" in line:
        value = line.split(":", 1)[1].strip()

        if value:
            return value

        if index + 1 < len(lines):
            return lines[index + 1].strip()

    return None


def extract_land_fields(text):
    fields = {
        "owner_name": None,
        "survey_number": None,
        "village": None,
        "district": None
    }

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    for index, line in enumerate(lines):
        lower_line = line.lower()

        # Owner Name
        if "owner" in lower_line or "ಮಾಲೀಕರ ಹೆಸರು" in line:
            fields["owner_name"] = extract_value_from_line(
                lines,
                index
            )

        # Survey Number
        elif "survey" in lower_line or "ಸರ್ವೆ" in line:
            fields["survey_number"] = extract_value_from_line(
                lines,
                index
            )

        # Village
        elif "village" in lower_line or "ಗ್ರಾಮ" in line:
            fields["village"] = extract_value_from_line(
                lines,
                index
            )

        # District
        elif "district" in lower_line or "ಜಿಲ್ಲೆ" in line:
            fields["district"] = extract_value_from_line(
                lines,
                index
            )

    return fields


def validate_land_fields(fields):
    required_fields = {
        "owner_name": "Owner Name",
        "survey_number": "Survey Number",
        "village": "Village",
        "district": "District"
    }

    missing_fields = []

    for key, label in required_fields.items():
        value = fields.get(key)

        if not value or not value.strip():
            missing_fields.append(label)

    if missing_fields:
        return {
            "status": "incomplete",
            "is_valid": False,
            "message": "Some required fields could not be detected.",
            "missing_fields": missing_fields
        }

    return {
        "status": "valid",
        "is_valid": True,
        "message": "All required land-record fields were detected.",
        "missing_fields": []
    }


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


@app.route("/api/ocr", methods=["POST"])
def ocr():
    if "image" not in request.files:
        return jsonify({
            "status": "error",
            "message": "No image uploaded"
        }), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({
            "status": "error",
            "message": "No image selected"
        }), 400

    try:
        image = Image.open(file.stream)

        text = pytesseract.image_to_string(
            image,
            lang="eng+kan"
        )

        fields = extract_land_fields(text)

        validation = validate_land_fields(fields)

        return jsonify({
            "status": "success",
            "text": text,
            "fields": fields,
            "validation": validation
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )