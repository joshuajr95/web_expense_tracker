'''
Author: Joshua Jacobs-Rebhun
Date: July 14, 2022

This file implements the database queries that the website uses for things
like login, signup, adding and deleting expenses, and changing account information.
The function are wrappers for MySQL queries so that the application does not
need to have raw SQL in the main file.
'''

import pymysql.cursors
from .classes import BankAccount


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
def get_user_id(email):
    
    connection = pymysql.connect(host='localhost',
                            user='web_expense_tracker',
                            password='password',
                            database='web_expenses',
                            cursorclass=pymysql.cursors.DictCursor)
    
    result = None

    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT `id` FROM `Users` WHERE `email`=%s", email)
            result = cursor.fetchone()
    
    return str(result["id"])



def get_user_name(email):

    connection = pymysql.connect(host='localhost',
                            user='web_expense_tracker',
                            password='password',
                            database='web_expenses',
                            cursorclass=pymysql.cursors.DictCursor)
    
    result = None

    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT `first_name`, `last_name` FROM `Users` WHERE `email`=%s", email)
            result = cursor.fetchone()
    
    return result["first_name"], result["last_name"]


def update_user_info(user_id, first_name, last_name, email):

    connection = pymysql.connect(host='localhost',
                            user='web_expense_tracker',
                            password='password',
                            database='web_expenses',
                            cursorclass=pymysql.cursors.DictCursor)
    
    rows_affected = 0

    with connection:
        with connection.cursor() as cursor:
            rows_affected = cursor.execute("UPDATE `Users` SET `first_name`=%s, `last_name`=%s, `email`=%s", (first_name, last_name, email))

        connection.commit()

    return (rows_affected == 1)



def get_bank_accounts(userID):

    connection = pymysql.connect(host='localhost',
                            user='web_expense_tracker',
                            password='password',
                            database='web_expenses',
                            cursorclass=pymysql.cursors.DictCursor)
    
    results = None

    with connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT `account_name`, `account_number`, `routing_number`, `id` FROM `bank_accounts` WHERE `user_id_number`=%s", userID)
            results = cursor.fetchall()
    
    bank_accounts = []

    for result in results:
        bank_accounts.append(BankAccount(result["account_name"], result["account_number"], result["routing_number"], result["id"]))
    

    return bank_accounts


def delete_bank_account(user_id, account_id):

    connection = pymysql.connect(host='localhost',
                            user='web_expense_tracker',
                            password='password',
                            database='web_expenses',
                            cursorclass=pymysql.cursors.DictCursor)
    
    rows_affected = 0

    with connection:
        with connection.cursor() as cursor:
            rows_affected = cursor.execute("DELETE FROM `bank_accounts` WHERE `id`=%s", account_id)
    
        connection.commit()

    return (rows_affected == 1)


def add_bank_account(user_id, account_name, account_number, routing_number):

    connection = pymysql.connect(host='localhost',
                            user='web_expense_tracker',
                            password='password',
                            database='web_expenses',
                            cursorclass=pymysql.cursors.DictCursor)

    account_id = None

    with connection:
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO `bank_accounts` (`account_name`, `account_number`, `routing_number`, `user_id_number`) VALUES (%s, %s, %s, %s)", (account_name, account_number, routing_number, user_id))
            cursor.execute("SELECT `id` FROM `bank_accounts` WHERE `account_number` = %s AND `routing_number` = %s", (account_number, routing_number))
            account_id = cursor.fetchone()

        connection.commit()

    return BankAccount(account_name, account_number, routing_number, account_id)


def modify_bank_account(account_id, user_id, account_name, account_number, routing_number):

    connection = pymysql.connect(host='localhost',
                            user='web_expense_tracker',
                            password='password',
                            database='web_expenses',
                            cursorclass=pymysql.cursors.DictCursor)

    with connection:
        with connection.cursor() as cursor:
            cursor.execute("UPDATE `bank_accounts` SET `account_name`=%s, `account_number`=%s, `routing_number`=%s, `user_id_number`=%s WHERE `id`=%s", (account_name, account_number, routing_number, user_id, account_id))
        
        connection.commit()
    
    return BankAccount(account_name, account_number, routing_number, account_id)



def add_expenses(expenses):
    pass



