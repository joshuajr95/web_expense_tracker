'''
Author: Joshua Jacobs-Rebhun
Date: July 14, 2022

This file implements the database queries that the website uses for things
like login, signup, adding and deleting expenses, and changing account information.
The function are wrappers for MySQL queries so that the application does not
need to have raw SQL in the main file.
'''

import pymysql.cursors


# verifies the given login credentials
def verify_login(email, password):
    connection = pymysql.connect(host='localhost',
                            user='web_expense_tracker',
                            password='password',
                            database='web_expenses',
                            cursorclass=pymysql.cursors.DictCursor)
    
    
    cursor = connection.cursor()
    cursor.execute("SELECT `password_hash` FROM `Users` WHERE `email`=%s", (email,))

    result = cursor.fetchone()

    connection.close()
    
    if not result:
        print(result)
        return False
    
    if password == result['password_hash']:
        return True
    else:
        return False
    


# Checks database for existing email on signup and returns True
# if the given email already exists in the database
def already_exists(email):
    connection = pymysql.connect(host='localhost',
                            user='web_expense_tracker',
                            password='password',
                            database='web_expenses',
                            cursorclass=pymysql.cursors.DictCursor)
    
    result = None

    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM `Users` WHERE `email`=%s", email)

            result = cursor.fetchone()

    if not result:
        return False
    
    return True


# implements the signup by checking for preexisting accounts and then
# inserting the given data into the database if there is no previously
# existing account. Returns False if the signup was unsuccessful, and
# True otherwise
def sign_up(first_name, last_name, email, password):
    
    if already_exists(email):
        return False
    
    connection = pymysql.connect(host='localhost',
                            user='web_expense_tracker',
                            password='password',
                            database='web_expenses',
                            cursorclass=pymysql.cursors.DictCursor)
    

    with connection:
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO `Users` (`first_name`, `last_name`, `email`, `password_hash`, `signup_date`) VALUES (%s, %s, %s, %s, now())", (first_name, last_name, email, password))

        connection.commit()
    
    return True


# get_user info from the database
def get_user(email):
    
    connection = pymysql.connect(host='localhost',
                            user='web_expense_tracker',
                            password='password',
                            database='web_expenses',
                            cursorclass=pymysql.cursors.DictCursor)
    
    result = None

    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT `first_name`, `id` FROM `Users` WHERE `email`=%s", email)
            result = cursor.fetchone()
    
    return result["first_name"] + str(result["id"])
    

