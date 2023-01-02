import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///users.db")

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/")
@login_required
def index():
    """Show welcome page"""

    # Bring the users to the homepage when login to the website
    return render_template("index.html")

@app.route("/home")
def home():
    """Show welcome page"""

    # Bring the users to the homepage via GET method
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""
    """source code from pset9"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 400)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 400)

        # Ensure confirmation of password is submitted
        elif not request.form.get("confirmation"):
            return apology("must provide confirmation", 400)

        # Ensure that the password and the confirmation is the same
        elif request.form.get("password") != request.form.get("confirmation"):
            return apology("password and confirmation is not the same", 400)

        # If the users name table is not created then do nothing
        if len(db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))) != 1:
            if len(db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))) == 0:
                pass

        # Ensure username exists
        else:
            return apology("username already exits", 400)

        # Create variable that use generate_password_hash() to create hashed password
        hash_password = generate_password_hash(request.form.get("password"), method='pbkdf2:sha256')

        # Insert the user's log in information to the table
        db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", request.form.get("username"), hash_password)

        data = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Remember which user has logged in
        session["user_id"] = data[0]["id"]

        # When registration is complete bring the users to the homepage
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:

        # Bring the users to register's page
        return render_template("register.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/main", methods=["GET", "POST"])
def main():
    """Show users main content"""

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

            # Check if the value that users submitted is 'siam' or not
            if str(request.form.get("places")) == "siam":

                # Bring the list of dict that is community's transport
                data_commu = db.execute("SELECT price FROM commu_trans")

                # Bring the list of dict that is Airport Rail Link's price and BTS's price
                data_trans_public = db.execute("SELECT A.airport_link AS airport_link, B.bts AS bts FROM fare A, fare B WHERE A.stations = 6 AND B.stations = 2")

                # Select the value into variables
                commu_p = data_commu[0]["price"]
                air_p = data_trans_public[0]["airport_link"]
                bts_p = data_trans_public[0]["bts"]

                # Sum all of the price that use to transport
                total = commu_p + air_p + bts_p

                # Bring the users to the route's siam page and return variable for jinja syntax
                return render_template("route-siam.html", commu_p=commu_p, air_p=air_p, bts_p=bts_p, total=total)

            # Check if the value that users submitted is 'kasetsart' or not
            elif str(request.form.get("places")) == "kasetsart":

                # Bring the list of dict that is community's transport
                data_commu = db.execute("SELECT price FROM commu_trans")

                # Bring the list of dict that is Airport Rail Link's price and BTS's price
                data_trans_public = db.execute("SELECT A.airport_link AS airport_link, B.bts AS bts FROM fare A, fare B WHERE A.stations = 6 AND B.stations = 6")

                # Select the value into variables
                commu_p = data_commu[0]["price"]
                air_p = data_trans_public[0]["airport_link"]
                bts_p = data_trans_public[0]["bts"]

                # Sum all of the price that use to transport
                total = commu_p + air_p + bts_p

                # Bring the users to the route's kasetsart page and return variable for jinja syntax
                return render_template("route-kaset.html", commu_p=commu_p, air_p=air_p, bts_p=bts_p, total=total)

            # Check if the value that users submitted is 'bencha-park' or not
            elif str(request.form.get("places") == "bencha-park"):

                # Bring the list of dict that is community's transport
                data_commu = db.execute("SELECT price FROM commu_trans")

                # Bring the list of dict that is Airport Rail Link's price and MRT's price
                data_trans_public = db.execute("SELECT A.airport_link AS airport_link, B.mrt_blue AS mrt FROM fare A, fare B WHERE A.stations = 4 AND B.stations = 2")

                # Select the value into variables
                commu_p = data_commu[0]["price"]
                air_p = data_trans_public[0]["airport_link"]
                mrt_p = data_trans_public[0]["mrt"]

                # Sum all of the price that use to transport
                total = commu_p + air_p + mrt_p

                # Bring the users to the route's kasetsart page and return variable for jinja syntax
                return render_template("route-bencha.html", commu_p=commu_p, air_p=air_p, mrt_p=mrt_p, total=total)

            # If the user input something that does not belong to input then return error page
            else:
                return apology("NOT FOUND", 404)

    # User reached route via GET (as by clicking a link or via redirect)
    return render_template("main.html")


@app.route("/contact")
def contact():
    """Show users contact and donate's badges"""

    # Bring the users to the homepage via GET method
    return render_template("contact.html")