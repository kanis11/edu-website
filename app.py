import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')
STATIC_DIR = os.path.join(BASE_DIR, 'static')
PDF_FOLDER = os.path.join(STATIC_DIR, 'pdfs')
ADMISSIONS_FILE = os.path.join(BASE_DIR, 'admissions.json')

os.makedirs(PDF_FOLDER, exist_ok=True)

app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
CORS(app)

CHAT_RESPONSES = {
    'admission': 'Admissions for 2026–27 are open! Visit our Admission page to fill the online form. Early applicants get a 10% fee concession.',
    'fee': 'Annual fees vary by grade from ₹45,000 (Primary) to ₹85,000 (Senior Secondary). Contact admissions@greenwoodacademy.edu for details.',
    'event': 'Check our Events page for upcoming Parent-Teacher meetings, sports meets, science fairs, and Annual Day celebrations.',
    'faculty': 'Our 120+ faculty members include Ph.D. holders and national-level coaches. Visit the Faculty page to meet our team.',
    'timing': 'School hours: 8:00 AM – 2:30 PM (Mon–Fri). Office hours: 9:00 AM – 4:00 PM.',
    'contact': 'Reach us at +91 11 4567 8900 or info@greenwoodacademy.edu. Campus: 42 Knowledge Park, New Delhi.',
    'transport': 'Safe bus service covers 25 routes across Delhi NCR. Transport fee is ₹18,000 per annum.',
    'default': 'Thank you for your inquiry! For admissions, events, fees, or campus info, please mention your topic or visit the relevant page.'
}


def get_chat_reply(message):
    msg = message.lower()
    for keyword, reply in CHAT_RESPONSES.items():
        if keyword != 'default' and keyword in msg:
            return reply
    if any(w in msg for w in ['hello', 'hi', 'hey', 'namaste']):
        return 'Hello! Welcome to Greenwood Academy. How can I help you today — admissions, events, fees, or faculty?'
    return CHAT_RESPONSES['default']


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/admission')
def admission():
    return render_template('admission.html')


@app.route('/gallery')
def gallery():
    return render_template('gallery.html')


@app.route('/faculty')
def faculty():
    return render_template('faculty.html')


@app.route('/events')
def events():
    return render_template('events.html')


@app.route('/download/pdf/<path:filename>')
def download_pdf(filename):
    return send_from_directory(PDF_FOLDER, filename, as_attachment=True)


@app.route('/api/chat', methods=['POST'])
def handle_chat():
    data = request.get_json() or {}
    user_message = data.get('message', '').strip()

    if not user_message:
        return jsonify({'status': 'error', 'reply': 'Please enter a valid message.'}), 400

    return jsonify({
        'status': 'success',
        'reply': get_chat_reply(user_message)
    }), 200


@app.route('/api/admission', methods=['POST'])
def handle_admission():
    data = request.get_json() or {}
    required = ['first_name', 'last_name', 'dob', 'gender', 'grade',
                'parent_name', 'relation', 'email', 'phone', 'address']

    missing = [f for f in required if not data.get(f, '').strip()]
    if missing:
        return jsonify({
            'status': 'error',
            'message': f'Please fill all required fields: {", ".join(missing)}.'
        }), 400

    import json
    applications = []
    if os.path.exists(ADMISSIONS_FILE):
        with open(ADMISSIONS_FILE, 'r', encoding='utf-8') as f:
            try:
                applications = json.load(f)
            except json.JSONDecodeError:
                applications = []

    applications.append(data)
    with open(ADMISSIONS_FILE, 'w', encoding='utf-8') as f:
        json.dump(applications, f, indent=2, ensure_ascii=False)

    name = data.get('first_name', 'Student')
    return jsonify({
        'status': 'success',
        'message': f'Thank you, {name}! Your application has been received. We will contact you at {data.get("email")} within 3 working days.'
    }), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
