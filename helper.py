import requests
import pandas as pd
import sqlalchemy as db
import os
import json 


def save_users_to_database(user_info, user_db):
    data_frame = pd.DataFrame(user_info, columns=['username', 'password'])
    engine = db.create_engine(f'sqlite:///{user_db}.db')
    with engine.connect() as connection:
        data_frame.to_sql('book_info_table', con=connection, if_exists='replace', index=False)