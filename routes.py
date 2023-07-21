from flask import Flask, render_template, url_for, flash, redirect, request, jsonify
from forms import RegistrationForm
import smtplib
from email.message import EmailMessage
import ssl
from bs4 import BeautifulSoup
import requests
import certifi
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
list_cards_string = '' # Define list_cards as a global variable
updated_list_cards = []

app.config['SECRET_KEY'] = '1324f97949e0f2c0cb404cbbfe9b9c9d'
# Create a sqlite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

@app.route("/")
def home():
    return render_template('main.html')

@app.route("/shop")
def shop():
    return render_template('shopping.html')

@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    existing_user = User.query.filter_by(username=form.username.data).first()
    if existing_user:
        # if it does show this message
        flash('Username is already taken. Please choose a different username.', 'danger')
    else:
        #check if a user withe a specific email exists in User database
        existing_email = User.query.filter_by(email=form.email.data).first()
        if existing_email:
            flash('Email is already taken. Please choose a different email.', 'danger')
        else:
            # if the username and the email does not exist a new User object is created
            new_user = User(username=form.username.data, email=form.email.data, password=form.password.data)
            # the new user is added to the database session
            db.session.add(new_user)
            # the changes are commited to the dabase
            db.session.commit()
            # display the following message
            
            flash(f'Account created for {form.username.data}!', 'success')

            email_sender = 'meh.fruits@gmail.com'
            email_password = 'lenbbbooyivmubzq'
            email_receiver = form.email.data
            subject = 'Receipt for StoreFront'
            
            body = f"""
                Thank you for Shopping with us!!
                This is your receipt.
            """

            # Create the HTML table content

            table_html = """
            <table style="border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
            """

            total_price = 0

            for item in updated_list_cards:
                if item != None: 
                    name = item['name']
                    price = item['price']
                    quantity = item['quantity']

                    total_price += price * quantity

                    row_html = f"""
                    <tr>
                        <td>{name}</td>
                        <td>{price}</td>
                        <td>{quantity}</td>
                    </tr>
                    """

                    table_html += row_html 

            total_row_html = f"""
            <tr>
                <td>Total Price</td>
                <td>{total_price}</td>
                <td></td>
            </tr>
            """

            table_html += total_row_html

            table_html += """
                </tbody>
            </table>
            """

            body += table_html

            em = EmailMessage()
            em['From'] = email_sender
            em['To'] = email_receiver
            em['Subject'] = subject
            em.set_content(body, subtype='html')  # Set email content as HTML

            context = ssl.create_default_context(cafile=certifi.where())

            with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
                smtp.login(email_sender, email_password)
                smtp.send_message(em)

            return redirect(url_for('home'))  # if valid - send to home page

    return render_template('payment.html', title='Register', form=form)

@app.route("/update_cart", methods=['POST'])
def update_cart():
    global list_cards_string
    global updated_list_cards
    data = request.json  # Retrieve the JSON data sent from the frontend
    updated_list_cards = data  # Assign the updated data to a new list variable
    list_cards_string = str(updated_list_cards)  # Convert the list to a string representation
    return list_cards_string  # Return the updated list_cards data as a string


@app.route("/log_in", methods=['GET', 'POST'])
def log_in():
    #create an instance of the log class
    form = log()
    if form.validate_on_submit():
        # This queries in the database to find the username and password with the provided username and password
        user = User.query.filter_by(username=form.username.data, password=form.password.data).first()
        # if the username is found stores the user ID in the session and will be redirected to the main page  
        if user:
            session['user_id'] = user.id
            email_sender = 'meh.fruits@gmail.com'
            email_password = 'lenbbbooyivmubzq'
            email_receiver = user.email
            subject = 'Receipt for StoreFront'
            
            body = f"""
                Thank you for Shopping with us!!
                This is your receipt.
            """

            # Create the HTML table content

            table_html = """
            <table style="border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
            """

            total_price = 0

            for item in updated_list_cards:
                if item != None: 
                    name = item['name']
                    price = item['price']
                    quantity = item['quantity']

                    total_price += price * quantity

                    row_html = f"""
                    <tr>
                        <td>{name}</td>
                        <td>{price}</td>
                        <td>{quantity}</td>
                    </tr>
                    """

                    table_html += row_html 

            total_row_html = f"""
            <tr>
                <td>Total Price</td>
                <td>{total_price}</td>
                <td></td>
            </tr>
            """

            table_html += total_row_html

            table_html += """
                </tbody>
            </table>
            """

            body += table_html

            em = EmailMessage()
            em['From'] = email_sender
            em['To'] = email_receiver
            em['Subject'] = subject
            em.set_content(body, subtype='html')  # Set email content as HTML

            context = ssl.create_default_context(cafile=certifi.where())

            with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
                smtp.login(email_sender, email_password)
                smtp.send_message(em)

            flash('Email Sent! Check your inbox hottie :)')

            return redirect(url_for('home'))  # if valid - send to home page
        # if the username is not found then flash the message below
        else:
            flash('Invalid username or password. Please try again.', 'danger')
    return render_template('log_in.html', subtitle='Log In', form=form)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8000)

