'''
This is the framework code for the web expense tracker web application.
'''


from flask import Flask, render_template, url_for


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/expenses")
def expenses():
    return render_template("expense_table.html")


@app.route("/about")
def about():
    return render_template("about.html")


if __name__ == "__main__":
    app.run()


