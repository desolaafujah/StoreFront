# Import necessary modules from Flask and WTForms
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, IntegerField, SelectField, RadioField
from wtforms.validators import DataRequired, Length, Email, EqualTo
from flask import Flask, render_template, url_for

# Define a form class for user registration
class RegistrationForm(FlaskForm):
    # Custom validation function to check if the username already exists
    def register_check(username):
        user = User.filter_by(username=username).first()
        if user == username:
            return False
        else:
            return True

    # Form fields and validators
    username = StringField('Username', validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')


# Define a form class for user login
class LogForm(FlaskForm):
    # Custom validation function to check if the username exists for login
    def login_check(username):
        user = User.filter_by(username=username).first()
        if user == username:
            return True
        else:
            return False

    # Form fields and validators
    username = StringField('Username', validators=[DataRequired(), Length(min=2, max=20)])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')