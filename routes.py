from flask import Flask, render_template, url_for, flash, redirect, request, jsonify
from forms import RegistrationForm
import smtplib
from email.message import EmailMessage
import ssl
from bs4 import BeautifulSoup
import requests
import certifi

app = Flask(__name__)
list_cards_string = '' # Define list_cards as a global variable
updated_list_cards = []

app.config['SECRET_KEY'] = '1324f97949e0f2c0cb404cbbfe9b9c9d'

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

@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
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


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8000)

