from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('start.html')


@app.route('/game')
def game():
    return render_template('index.html')


@app.route('/end')
def end():
    return render_template('end2.html')

@app.route('/end2')
def end2():
    return render_template('end.html')





if __name__ == "__main__":
    app.run(debug=True, port=5000)