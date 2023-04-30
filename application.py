'''
This is the framework code for the web expense tracker web application.
'''


from flask import Flask, render_template, url_for, request, Response, redirect, session
from flask_session.__init__ import Session
from python_modules.database_queries import *

import json



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
        user_id = get_user_id(session.get("email"))
        return redirect(url_for('home', user_id=user_id))

    if request.method == 'POST':
        if 'login-form' in request.form:
            email = request.form.get("email")
            password = request.form.get("password")

            if verify_login(email, password):
                session["email"] = email
                user_id = get_user_id(email)
                return redirect(url_for('home', user_id=user_id))
            else:
                error = "Invalid email or password."

        elif 'signup-form' in request.form:
            first_name = request.form.get("first-name")
            last_name = request.form.get("last-name")
            email = request.form.get("email")
            password = request.form.get("password")

            if sign_up(first_name, last_name, email, password):
                session["email"] = email
                user_id = get_user_id(email)
                return redirect(url_for('home', user_id=user_id))
            else:
                error = "Account already exists"

    return render_template("index.html", error=error)


@app.route("/<user_id>/home")
def home(user_id):
    if not session["email"]:
        return redirect(url_for("index"))
    
    first_name, last_name = get_user_name(session.get("email"))
    return render_template("homepage.html", user_id=user_id, first_name=first_name, last_name=last_name, email=session.get("email"))


@app.route("/<user_id>/myexpenses")
def myexpenses(user_id):
    if not session["email"]:
        return redirect(url_for("index"))
    
    return render_template("expenses.html", user_id=user_id)


@app.route("/<user_id>/addexpenses")
def addexpenses(user_id):
    if not session["email"]:
        return redirect(url_for("index"))
    
    return render_template("addexpenses.html", user_id=user_id)


@app.route("/<user_id>/expenses", methods=['GET', 'POST', 'PUT', 'DELETE'])
def expenses(user_id):
    if not session["email"]:
        return redirect(url_for("index"))
    
    if request.method == 'GET':
        pass
    elif request.method == 'PUT':
        pass
    elif request.method == 'POST':
        pass
    elif request.method == 'DELETE':
        pass


@app.route("/<user_id>/bankaccounts", methods=['GET', 'POST', 'PUT', 'DELETE'])
def bankaccounts(user_id):
    if not session["email"]:
        return redirect(url_for("index"))
    
    if request.method == 'POST':
        account_name = request.headers.get("account-name")
        account_number = request.headers.get("account-number")
        routing_number = request.headers.get("routing-number")

        bank_account = add_bank_account(user_id, account_name, account_number, routing_number)
        return Response(json.dumps(bank_account.__dict__), mimetype='application/json')
    
    elif request.method == 'DELETE':
        account_id = request.headers.get("account-id")
        
        if delete_bank_account(user_id, account_id):
            return Response(status=200)
        else:
            return Response(status=204)
    
    elif request.method == 'PUT':
        account_name = request.headers.get("account-name")
        account_number = request.headers.get("account-number")
        routing_number = request.headers.get("routing-number")
        account_id = request.headers.get("account_id")

        bank_account = modify_bank_account(account_id, user_id, account_name, account_number, routing_number)
        print(bank_account)
        return Response(json.dumps(bank_account.__dict__), mimetype='application/json')

    elif request.method == 'GET':
        bank_accounts = get_bank_accounts(user_id)

        return Response(json.dumps([account.__dict__ for account in bank_accounts]), mimetype='application/json')


@app.route("/<user_id>/accountinfo", methods=['GET', 'PUT'])
def accountinfo(user_id):
    if not session["email"]:
        return redirect(url_for("index"))
    
    if request.method == 'PUT':
        first_name = request.headers.get("first-name")
        last_name = request.headers.get("last-name")
        email = request.headers.get("email")

        if email != session["email"]:
            pass #send email to user

        if update_user_info(user_id, first_name, last_name, email):
            session["email"] = email
            return Response(status=200)
        else:
            return Response(status=204)


# route for adding expenses to the database
@app.route("/<userid>/commitexpenses")
def commitexpenses():
    if not session["email"]:
        return redirect(url_for("index"))
    
    if request.method == "POST":
        expenses = json.loads(request.data)
        add_expenses(expenses.expenses)

        return redirect(url_for())


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


