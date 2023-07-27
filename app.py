from flask import Flask, render_template, url_for, flash, redirect, request, jsonify, session, get_flashed_messages
import smtplib
from email.message import EmailMessage
import ssl
from bs4 import BeautifulSoup
import requests
import certifi
from flask_sqlalchemy import SQLAlchemy
from forms import RegistrationForm, LogForm
from helper import save_users_to_database
from datetime import datetime
import json
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)
list_cards_string = '' # Define list_cards as a global variable
updated_list_cards = []

app.config['SECRET_KEY'] = '1324f97949e0f2c0cb404cbbfe9b9c9d'
# Create a sqlite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///new_database.db'
db = SQLAlchemy(app)

@app.route("/")
def home():
    return render_template('main.html')

@app.route("/shop")
def shop():
    return render_template('shopping.html')

@app.route("/vintage")
def vintage():
    return render_template('vintage.html')

@app.route("/nightout")
def nightout():
    return render_template('nighout.html')

@app.route("/casual")
def casual():
    return render_template('casual.html')

@app.route("/summer")
def summer():
    return render_template('summer.html')

@app.route("/userAccount")
def userAccount():
    return render_template('userAccount.html')

@app.route("/get_flash_messages")
def get_flash_messages():
    flash_messages = get_flashed_messages(with_categories=True, category_filter=["success"])
    return jsonify(flash_messages)

@app.route("/my_account")
def my_account():
    user_id = session.get('user_id')  # Get the logged-in user's ID from the session
    if user_id:
        Session = sessionmaker(bind=db.engine)
        db_session = Session()
        user = db_session.get(User, user_id)  # Retrieve the user object from the database using the ID

        if user:
            # Fetch the user's past orders from the database, if applicable
            past_orders = fetch_past_orders(user)
            past_order_details = [order.details for order in past_orders]
            db_session.close()
            return render_template('my_account.html', user=user, past_orders=past_orders)

    # If the user is not logged in or not found in the database, redirect them to the login page
    flash('Please log in to access your account.', 'warning')
    return redirect(url_for('log_in'))

def fetch_past_orders(user):
    # Assuming you have an "Order" model that represents past orders with a foreign key to the User model
    past_orders = Order.query.filter_by(user=user).all()
    return past_orders

@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    # Query the database to check if the username already exists
    existing_user = User.query.filter_by(username=form.username.data).first()

    if form.validate_on_submit():
        if existing_user:
            flash('Username is already taken. Please choose a different username.', 'danger')
        else:
            # Check if the email already exists in the database
            existing_email = User.query.filter_by(email=form.email.data).first()
            if existing_email:
                flash('Email is already taken. Please choose a different email.', 'danger')
            else:
                # Create a new user object and add it to the database
                new_user = User(
                    username=form.username.data,
                    email=form.email.data,
                    password=form.password.data
                )
                db.session.add(new_user)
                db.session.commit()
                
                # Display a success message for successful registration
                flash(f'Account created for {form.username.data}!', 'success')

                 # Prepare and send an email to the user

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
                            <th>Product Link</th>
                        </tr>
                    </thead>
                    <tbody>
                """

                total_price = 0
                updated_list_cards = session.get('cart', []) 

                for item in updated_list_cards:
                    if item != None: 
                        name = item['name']
                        price = item['price']
                        quantity = item['quantity']
                        brand = item['brand']
                        link = item['link']

                        total_price += price * quantity

                        row_html = f"""
                        <tr>
                            <td>{name}</td>
                            <td>{price}</td>
                            <td>{quantity}</td>
                            <td><a href={link} class="link">{brand}</a>
                        </tr>
                        """

                        table_html += row_html
                        
                         
                if total_price > 0: 
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

                    if new_user.id:
                        new_order = Order(user_id=new_user.id)  # Associate the order with the newly created user
                        # Add more order details to the order, e.g., items, total price, etc.
                        new_order.details = table_html
                        new_order.total_price = total_price
                        db.session.add(new_order)
                        db.session.commit()

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

                return redirect(url_for('my_account'))  # if valid - send to home page

    return render_template('payment.html', title='Register', form=form)

# Route to update the cart data
@app.route("/update_cart", methods=['POST'])
def update_cart():
    #global list_cards_string
    #global updated_list_cards
    data = request.json  # Retrieve the JSON data sent from the frontend
    session['cart'] = data  # Store the cart data in the session
    return "Cart updated successfully", 200
    #updated_list_cards = data  # Assign the updated data to a new list variable
    #list_cards_string = str(updated_list_cards)  # Convert the list to a string representation
    #return list_cards_string  # Return the updated list_cards data as a string


@app.route("/log_in", methods=['GET', 'POST'])
def log_in():
    # create an instance of the log class
    form = LogForm()
    if form.validate_on_submit():
        # This queries the database to find the username and password with the provided username and password
        user = User.query.filter_by(username=form.username.data, password=form.password.data).first()
        # if the username is found, store the user ID in the session and redirect to the main page
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
                        <th>Product Link</th>
                    </tr>
                </thead>
                <tbody>
            """

            total_price = 0

            updated_list_cards = session.get('cart', [])

            for item in updated_list_cards:
                if item is not None:
                    name = item['name']
                    price = item['price']
                    quantity = item['quantity']
                    brand = item['brand']
                    link = item['link']

                    total_price += price * quantity

                    row_html = f"""
                    <tr>
                        <td>{name}</td>
                        <td>{price}</td>
                        <td>{quantity}</td>
                        <td><a href={link} class="link">{brand}</a></td>
                    </tr>
                    """

                    table_html += row_html

            if total_price > 0: 
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

                if user.id:
                    new_order = Order(user_id=user.id)  # Associate the order with the newly created user
                    # Add more order details to the order, e.g., items, total price, etc.
                    new_order.details = table_html
                    new_order.total_price = total_price
                    db.session.add(new_order)
                    db.session.commit()

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

            return redirect(url_for('my_account'))  # if valid - send to home page

        # if the username is not found then flash the message below
        else:
            flash('Invalid username or password. Please try again.', 'danger')

    return render_template('log_in.html', subtitle='Log In', form=form)

    
# Auto-deployment route for PythonAnywhere
@app.route("/update_server", methods=['POST'])
def webhook():
    if request.method == 'POST':
        repo = git.Repo('/home/bodyfitapp/Project-2')
        origin = repo.remotes.origin
        origin.pull()
        return 'Updated PythonAnywhere successfully', 200
    else:
        return 'Wrong event type', 400

# Define the User database model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    orders = db.relationship('Order', backref='user', lazy=True)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    details = db.Column(db.Text, nullable=False)  # Add 'details' field to store the order details as text
    total_price = db.Column(db.Float, nullable=False)  # Add 'total_price' field to store the total price of the order

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8000)