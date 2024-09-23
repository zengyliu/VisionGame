from flask import Flask, send_from_directory

app = Flask(__name__)

@app.route('/words/<language>')
def get_words(language):
    # Logic to read from words.txt or chinese.txt based on 'language'
    pass

@app.route('/')
def home():
    return send_from_directory('static', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)