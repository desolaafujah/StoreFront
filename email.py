from flask import Flask, render_template, url_for, flash, redirect, request
from forms import RegistrationForm
from flask_behind_proxy import FlaskBehindProxy
import requests
import sqlite3
import os
from email.message import EmailMessage
import ssl
import smtplib

app = Flask(__name__)
proxied = FlaskBehindProxy(app)
app.config['SECRET_KEY'] = '1324f97949e0f2c0cb404cbbfe9b9c9d'


@app.route("/")
def home():
    return render_template('practice.html', count=click_count)

@app.route("/increment", methods=['POST'])
def increment():
    global click_count
    click_count += 1
    return str(click_count)

@app.route("/cart")
def cart():
    return render_template('result.html', numbers = {click_count})


@app.route("/pay", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():  # checks if entries are valid
        flash(f'Account created for {form.username.data}!', 'success')

        email_sender = 'meh.fruits@gmail.com'
        email_password = 'pykddcyafousrqfs'
        email_receiver = form.email.data # getting the emial from the form
        subject = 'Receipt for StoreFront'
        body = f"""
            Thank you for Shopping with us!!
            This is your receipt.
        """
        em = EmailMessage()
        em['From'] = email_sender
        em['To'] = email_receiver
        em['Subject'] = subject
        em.set_content(body)

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
            smtp.login(email_sender, email_password)
            smtp.send_message(em)

        return redirect(url_for('home'))  # if valid - send to home page

    return render_template('payment.html', title='Register', form=form) # if not - stay in the same page


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
