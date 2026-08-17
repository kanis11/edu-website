from flask import Flask, render_template

app = Flask(__name__, template_folder='public', static_folder='static')

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

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
