from flask import Flask, render_template, url_for, flash, redirect
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
@app.route("/home")
def home():
    return render_template('home.html', subtitle='Home Page', text='This is the home page')


@app.route("/second_page")
def second_page():
    return render_template('second_page.html', subtitle='Second Page', text='This is the second page')


@app.route("/payment", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():  # checks if entries are valid
        flash(f'Account created for {form.username.data}!', 'success')
        email_sender = 'seogroup15.doctorsappts@gmail.com'
        email_password = 'ocprspypzcffooik'
        email_receiver = {form.email.data}
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
            smtp.sendmail(email_sender, email_receiver, em.as_string())
        return redirect(url_for('home'))  # if so - send to home page
    return render_template('payment.html', title='Register', form=form)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
