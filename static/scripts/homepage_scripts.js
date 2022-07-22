/* Author: Joshua Jacobs-Rebhun
 * Date: July 18, 2022
 *
 *
 * This file implements a number of scripts that are used to load information
 * for a given user's homepage.
 */


let editing = false;
let account_id = 0;


function isDescendent(domElement, ancestorElement)
{
    let currentNode = domElement;

    while(currentNode != null)
    {
        if(currentNode == ancestorElement)
        {
            return true;
        }
        currentNode = currentNode.parentElement;
    }

    return false;
}


/*
 * Callback function for when the 'add expense' button is clicked.
 * Displays the expense form.
 */
function displayForm(formDiv)
{
    formDiv.style.display = "block";

    let nodes = document.querySelectorAll('body *');

    
    nodes.forEach( element => {
        if(!isDescendent(element, formDiv))
        {
            element.style.filter = "blur(1px)";
            element.style.opacity = "0.7";
        }
        else
        {
            element.style.filter = "blur(0)";
        }
    });
}

/*
 * Callback function for X button click. Hides the form.
 */
function hideForm(formElement, formDiv)
{
    document.querySelectorAll('body *').forEach( element => {
        element.style.opacity = "1";
        element.style.filter = "blur(0)";
    });

    formElement.reset();
    editing = false;
    account_id = 0;
    formDiv.style.display = "none";
}


function editAccount(event)
{
    let accountFormDiv = document.querySelector("#bank-account-form-div");
    let accountForm = document.querySelector("#bank-account-form");

    
    let editButton = document.getElementById(event.target.id);
    let rowID = "row-" + editButton.id.split("-")[2];
    let row = document.getElementById(rowID);

    let accountName = row.children[0].innerHTML;
    let accountNumber = row.children[1].innerHTML;
    let routingNumber = row.children[2].innerHTML;

    let nameInput = document.querySelector("#account-name");
    let accountNumberInput = document.querySelector("#account-number");
    let routingNumberInput = document.querySelector("#routing-number");

    nameInput.value = accountName;
    accountNumberInput.value = accountNumber;
    routingNumberInput.value = routingNumber;

    editing = true;
    account_id = parseInt(editButton.id.split("-")[2]);

    displayForm(accountFormDiv);
}


function removeAccount(event)
{
    let removeButtonID = event.target.id;
    let rowID = "row-" + removeButtonID.split("-")[2];
    let row = document.getElementById(rowID);

    let accountID = parseInt(removeButtonID.split("-")[2]);

    let xhr = new XMLHttpRequest();
    let endpoint = "/" + user_id.toString() + "/bankaccounts";

    xhr.open("DELETE", endpoint, true);
    xhr.setRequestHeader("account-id", accountID.toString());
    
    xhr.onload = function() {
        if(this.status == 200) {
            row.remove();
        }
    }

    xhr.send();
}



function addAccountToTable(account)
{
    let tableBody = document.querySelector('#bank-account-table-body');

    let tableRow = document.createElement("tr");
    tableRow.id = "row-" + account.id.toString();

    // account name column
    let accountName = document.createElement("td");
    accountName.appendChild(document.createTextNode(account.name));
    tableRow.appendChild(accountName);

    // account number column
    let accountNumber = document.createElement("td");
    accountNumber.appendChild(document.createTextNode(account.account_number.toString()));
    tableRow.appendChild(accountNumber);

    // routing number column
    let routingNumber = document.createElement("td");
    routingNumber.appendChild(document.createTextNode(account.routing_number.toString()));
    tableRow.appendChild(routingNumber);

    // edit button
    let tableEdit = document.createElement("td");
    let editButton = document.createElement("button");
    editButton.appendChild(document.createTextNode("Edit"));
    editButton.classList.add("table-button");
    editButton.addEventListener('click', editAccount);
    editButton.id = "edit-button-" + account.id.toString();
    tableEdit.appendChild(editButton);
    tableRow.appendChild(tableEdit);

    // delete button
    let tableRemove = document.createElement("td");
    let removeButton = document.createElement("button");
    removeButton.appendChild(document.createTextNode("Delete"));
    removeButton.classList.add("table-button");
    removeButton.addEventListener('click', removeAccount);
    removeButton.id = "remove-button-" + account.id.toString();
    tableRemove.appendChild(removeButton);
    tableRow.appendChild(tableRemove);

    tableBody.appendChild(tableRow);
}


/* 
 * This function uses an AJAX request to get the bank accounts of the given user.
 */
function getBankAccounts(userID)
{
    // URL endpoint for getting bank accounts
    let endpoint = "/" + userID.toString() + "/bankaccounts";

    // make XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open('GET', endpoint, true);
    xhr.responseType = "json";

    // send it and get response
    xhr.onload = function() {
        if(this.status == 200) {
            for(let i = 0; i < this.response.length; i++) {
                addAccountToTable(this.response[i]);
            }
        }
    }

    xhr.send();
}


function updateBankAccountInfo()
{
    let accountName = document.querySelector("#account-name").value;
    let accountNumber = document.querySelector("#account-number").value;
    let routingNumber = document.querySelector("#routing-number").value;

    let endpoint = "/" + user_id.toString() + "/bankaccounts";

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", endpoint, true);

    xhr.setRequestHeader("account-name", accountName);
    xhr.setRequestHeader("account-number", accountNumber);
    xhr.setRequestHeader("routing-number", routingNumber);

    xhr.onload = function() {
        if(this.status == 200) {
            let rowID = "row-" + account_id.toString();
            document.getElementById(rowID).children[0].innerHTML = accountName;
            document.getElementById(rowID).children[1].innerHTML = accountNumber;
            document.getElementById(rowID).children[2].innerHTML = routingNumber;
        }
    }

    xhr.send();
}


function addBankAccount()
{
    let accountName = document.querySelector("#account-name").value;
    let accountNumber = document.querySelector("#account-number").value;
    let routingNumber = document.querySelector("#routing-number").value;

    let endpoint = "/" + user_id.toString() + "/bankaccounts";
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint, true);
    xhr.responseType = "json";
    
    xhr.setRequestHeader("account-name", accountName);
    xhr.setRequestHeader("account-number", accountNumber);
    xhr.setRequestHeader("routing-number", routingNumber);
    

    xhr.onload = function() {
        if(this.status == 200) {
            addAccountToTable(response.bankAccount);
        }
    }

    xhr.send();
}


function modifyClicked(event)
{
    let accountForm = document.querySelector("#account-info-form-div");
    displayForm(accountForm);
}


function addAccountClicked(event)
{
    let bankAccountForm = document.querySelector("#bank-account-form-div");
    displayForm(bankAccountForm);
}

function accountExitButtonClicked(event)
{
    let accountFormDiv = document.querySelector("#account-info-form-div");
    let accountForm = document.querySelector("#account-form");

    hideForm(accountForm, accountFormDiv);
}

function accountSubmitClicked(event)
{
    let firstName = document.querySelector("#first-name").value;
    let lastName = document.querySelector("#last-name").value;
    let email = document.querySelector("#Email").value;

    let endpoint = "/" + user_id.toString() + "/accountinfo";

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", endpoint, true);

    xhr.setRequestHeader("first-name", firstName);
    xhr.setRequestHeader("last-name", lastName);
    xhr.setRequestHeader("email", email);

    xhr.onload = function() {
        if(this.status == 200) {
            document.querySelector("#first-name-display").innerHTML = firstName;
            document.querySelector("#last-name-display").innerHTML = lastName;
            document.querySelector("#email-display").innerHTML = email;
        }
    }

    xhr.send();

    let accountInfoForm = document.querySelector("#account-form");
    let accountInfoFormDiv = document.querySelector("#account-info-form-div");
    hideForm(accountInfoForm, accountInfoFormDiv);
}

function bankAccountExitButtonClicked(event)
{
    let bankAccountFormDiv = document.querySelector("#bank-account-form-div");
    let bankAccountForm = document.querySelector("#bank-account-form");

    hideForm(bankAccountForm, bankAccountFormDiv);
}

function bankAccountSubmitClicked(event)
{
    if(editing)
    {
        updateBankAccountInfo();
        editing = false;
        account_id = 0;
    }
    else
    {
        addBankAccount();
    }

    let bankAccountForm = document.querySelector("#bank-account-form");
    let bankAccountFormDiv = document.querySelector("#bank-account-form-div");
    hideForm(bankAccountForm, bankAccountFormDiv);
}



window.onload = getBankAccounts(user_id);
