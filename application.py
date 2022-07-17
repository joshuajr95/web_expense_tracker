'''
This is the framework code for the web expense tracker web application.
'''


from flask import Flask, render_template, url_for, request, redirect, session
from flask_session.__init__ import Session
from python_modules.database_queries import verify_login, sign_up, get_user
#import pymysql.cursors

'''
from flask_sqlalchemy import SQLAlchemy
'''


app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

#app.secret_key = 

'''
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://<username>:<password>@localhost/<dbname>"
database = SQLAlchemy(app)
'''


@app.route("/", methods=['GET', 'POST'])
def index():
    error = None

    if session.get("email"):

        user = get_user(session.get("email"))
        return redirect(url_for('home', user=user))

    if request.method == 'POST':
        if 'login-form' in request.form:
            email = request.form.get("email")
            password = request.form.get("password")

            if verify_login(email, password):
                session["email"] = email
                user = get_user(email)
                return redirect(url_for('home', user=user))
            else:
                error = "Invalid email or password."

        elif 'signup-form' in request.form:
            print("Signing up")
            first_name = request.form.get("first-name")
            last_name = request.form.get("last-name")
            email = request.form.get("email")
            password = request.form.get("password")

            if sign_up(first_name, last_name, email, password):
                session["email"] = email
                user = get_user(email)
                return redirect(url_for('home', user=user))
            else:
                error = "Account already exists"

    return render_template("index.html", error=error)


@app.route("/<user>/home")
def home(user):
    if not session["email"]:
        return redirect(url_for("index"))
    
    return render_template("homepage.html", user=user)


@app.route("/<user>/expenses")
def expenses(user):
    if not session["email"]:
        return redirect(url_for("index"))
    
    return render_template("expenses.html", user=user)


@app.route("/<user>/addexpenses")
def addexpenses(user):
    if not session["email"]:
        return redirect(url_for("index"))
    
    return render_template("addexpenses.html", user=user)

'''
@app.route("/expenses")
def expenses():
    if not session.get("email"):
        return redirect(url_for("index"))

    return render_template("expense_table.html")
'''

@app.route("/login")
def login():
    if session.get("email"):
        user = get_user(session.get("email"))
        return redirect(url_for("home", user=user))
    
    return render_template("login.html")

@app.route("/logout")
def logout():
    if session["email"]:
        session.pop("email")

    return redirect(url_for('index'))

@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


if __name__ == "__main__":
    app.run()


