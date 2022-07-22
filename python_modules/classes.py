'''
Author: Joshua Jacobs-Rebhun
Date: July 20, 2022

This file implements a number of classes used for representing data in the
databases and transferring data to the user.
'''


class BankAccount:

    def __init__(self, name: str, account_number: int, routing_number: int, account_id: int):
        self.name = name
        self.account_number = account_number
        self.routing_number = routing_number
        self.id = account_id