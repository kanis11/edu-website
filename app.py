import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS

# Dynamically set absolute paths to prevent "Template/Static Not Found" errors
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')
STATIC_DIR = os.path.join(BASE_DIR, 'static')
PDF_FOLDER = os.path.join(STATIC_DIR, 'pdfs')

# Ensure PDF directory exists on server startup
os.makedirs(PDF_FOLDER, exist_ok=True)

app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
CORS(app)


@app.route('/')
def index():
    return render_template('index.html')


# Custom route for PDF downloads with forcing browser attachment
@app.route('/download/pdf/<path:filename>')
def download_pdf(filename):
    return send_from_directory(PDF_FOLDER, filename, as_attachment=True)


@app.route('/api/chat', methods=['POST'])
def handle_chat():
    data = request.get_json() or {}
    user_message = data.get('message', '').strip()

    if not user_message:
        return jsonify({
            'status': 'error',
            'reply': 'Please enter a valid message.'
        }), 400

    # Academic Support Assistant response logic
    bot_reply = f"Academic Advisor: Received your inquiry regarding '{user_message}'."

    return jsonify({
        'status': 'success',
        'reply': bot_reply
    }), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)