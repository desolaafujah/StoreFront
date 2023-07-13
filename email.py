from flask import Flask, render_template, url_for, flash, redirect, request
from forms import RegistrationForm
import smtplib
from email.message import EmailMessage
import ssl

app = Flask(__name__)
click_count = {f'item{i+1}': 0 for i in range(8)}

app.config['SECRET_KEY'] = '1324f97949e0f2c0cb404cbbfe9b9c9d'

@app.route("/")
@app.route("/home")
def home():
    return render_template('practice.html', count=click_count)

@app.route("/increment", methods=['POST'])
def increment():
    button_id = request.get_json().get('button_id')
    if button_id in click_count:
        click_count[button_id] += 1
    return str(click_count[button_id])

@app.route("/cart")
def cart():
    return render_template('result.html', numbers=click_count)

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
        em = EmailMessage()
        em['From'] = email_sender
        em['To'] = email_receiver
        em['Subject'] = subject
        em.set_content(body)

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
            smtp.login(email_sender, email_password)
            smtp.send_message(em)

        click_count = dict.fromkeys(click_count,0)    

        return render_template('practice.html', count=click_count)

    return render_template('register.html', title='Register', form=form)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
    
