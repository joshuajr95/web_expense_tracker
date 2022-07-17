CREATE DATABASE web_expenses;
USE web_expenses;


CREATE TABLE Users (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL,
    signup_date DATETIME,
    password_hash VARCHAR(256),

    PRIMARY KEY (id)
);


CREATE TABLE Expense_types (
    id  INTEGER NOT NULL AUTO_INCREMENT,
    expense_type VARCHAR(32) NOT NULL,

    PRIMARY KEY (id)
);


CREATE TABLE bank_accounts (
    id INTEGER NOT NULL AUTO_INCREMENT,
    account_number INTEGER,
    routing_number INTEGER,
    account_name VARCHAR(64) NOT NULL,
    user_id_number INTEGER,

    PRIMARY KEY (id),

    FOREIGN KEY (user_id_number) REFERENCES Users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);


CREATE TABLE Expenses (
    id INTEGER NOT NULL AUTO_INCREMENT,
    amount_dollars INTEGER NOT NULL,
    amount_cents INTEGER NOT NULL,
    expense_name VARCHAR(128) NOT NULL,
    expense_date DATE NOT NULL,
    expense_type INTEGER,
    account INTEGER,

    PRIMARY KEY (id),

    FOREIGN KEY (expense_type) REFERENCES Expense_types(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,

    FOREIGN KEY (expense_type) REFERENCES bank_accounts(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);


INSERT INTO Expense_types (expense_type) VALUES ("Credit");
INSERT INTO Expense_types (expense_type) VALUES ("Debit");
INSERT INTO Expense_types (expense_type) VALUES ("Cash");
INSERT INTO Expense_types (expense_type) VALUES ("Deposit");
INSERT INTO Expense_types (expense_type) VALUES ("Withdrawal");