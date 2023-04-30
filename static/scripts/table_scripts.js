/* Author: Joshua Jacobs-Rebhun
 * Date: July 10, 2022
 * 
 * 
 * These scripts are used by the expense table to display the expense form and
 * add, modify, and remove expenses from the expense table.
 */



// global variables for keeping track of number of table rows
//let numExpenses = 0;
//let nextExpenseNumber = 0;


//let rowToEdit = 0;
//let editing = false;


/*
 * The expenses data structure stores the expense objects and other
 * useful data for allowing dynamic generating, editing, and deletion
 * of expenses
 */
let expenses = {
    rowToEdit: 0,
    editing: false,
    numExpenses: 0,
    nextExpenseNumber: 0,
    expenses: {},
    rowsEdited: {},
    rowsRemoved: [],
    rowsAdded: []
};


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
    formDiv.style.display = "none";
}


/*
 * This is the callback function for when the edit button is clicked
 * for a given row
 */
function editExpense(event)
{
    // get the row from the table
    let buttonID = event.target.id;
    let rowNumber = buttonID.toString().split('-')[3];
    let rowID = '#row-' + rowNumber;
    let row = document.querySelector(rowID);

    // for keeping track of editing state
    expenses.editing = true;
    expenses.rowToEdit = parseInt(rowNumber);

    // get the values from the row
    let expenseName = row.children[0].innerHTML;
    let expenseDate = row.children[1].innerHTML;
    let expenseAmount = row.children[2].innerHTML;


    let nameInput = document.querySelector("#expense-name");
    let dateInput = document.querySelector("#date");
    let amountInput = document.querySelector("#amount");

    nameInput.value = expenseName;
    dateInput.value = expenseDate;
    amountInput.value = expenseAmount;

    let formDiv = document.querySelector('#expense-form-div');
    displayForm(formDiv);
}


/*
 * Callback function for when remove button is clicked for a given row
 */
function removeExpense(event)
{
    let buttonID = event.target.id;
    let rowNumber = buttonID.toString().split('-')[3];
    let rowIDSelector = "#row-" + rowNumber;
    let row = document.querySelector(rowIDSelector);

    /*
    let expenseName = row.children[0];
    let expenseDate = row.children[1];
    let expenseAmount = row.children[2];

    const expense = {
        name: expenseName,
        date: expenseDate,
        amount: expenseAmount
    };
    */


    row.remove();
    delete expenses.expenses[rowNumber];

    if(rowNumber in expenses.rowsAdded) {
        delete expenses.rowsAdded[rowNumber];
    }
    else if(rowNumber in expenses.rowsEdited) {
        delete expenses.rowsEdited[rowNumber];
    }

    expenses.rowsRemoved.push(rowNumber);
    expenses.numExpenses--;
}


/*
 * Validates the form to prevent empty rows
 */
function validateForm(event)
{
    let expenseName = document.querySelector('#expense-name').value;
    let expenseAmount = document.querySelector('#amount').value;
    let expenseDate = document.querySelector('#date').value;

    if(expenseName == '' || expenseAmount == '' || expenseDate == '')
    {
        return false;
    }

    return true;
}


function addNewRow(expense)
{

    // create new row for table
    const table_row = document.createElement("tr");
    table_row.id = "row-" + expenses.nextExpenseNumber.toString();

    // create new columns for new table element
    const table_data_name = document.createElement("td");
    const table_data_date = document.createElement("td");
    const table_data_amount = document.createElement("td");

    const table_data_edit_button = document.createElement("td");
    const table_data_remove_button = document.createElement("td");

    table_data_edit_button.setAttribute("width", "10%");
    table_data_remove_button.setAttribute("width", "10%");

    // create text content for each column
    const table_name_text = document.createTextNode(expense.name);
    const table_date_text = document.createTextNode(expense.date);
    const table_amount_text = document.createTextNode(expense.amount.toString());

    // add text to table columns
    table_data_name.appendChild(table_name_text);
    table_data_date.appendChild(table_date_text);
    table_data_amount.appendChild(table_amount_text);


    // create edit and remove buttons for each row
    const data_edit = document.createElement("button");
    const data_remove = document.createElement("button");

    // create text content for buttons
    const edit_text = document.createTextNode("Edit");
    const remove_text = document.createTextNode("Delete");

    // add button text nodes to button elements
    data_edit.appendChild(edit_text);
    data_remove.appendChild(remove_text);

    // add class to buttons to allow them to be styled properly
    data_edit.classList.add("table-button");
    data_remove.classList.add("table-button");

    data_edit.addEventListener('click', editExpense);
    data_remove.addEventListener('click', removeExpense);

    let data_edit_id = "data-edit-row-" + expenses.nextExpenseNumber.toString();
    let data_remove_id = "data-remove-row-" + expenses.nextExpenseNumber.toString();
    data_edit.id = data_edit_id;
    data_remove.id = data_remove_id;

    table_data_edit_button.appendChild(data_edit);
    table_data_remove_button.appendChild(data_remove);

    // add table columns to new table row
    table_row.appendChild(table_data_name);
    table_row.appendChild(table_data_date);
    table_row.appendChild(table_data_amount);

    table_row.appendChild(table_data_edit_button);
    table_row.appendChild(table_data_remove_button);

    // add row to table
    let expense_table = document.querySelector('#expense-table-body');
    expense_table.appendChild(table_row);
}


function modifyExistingRow(expense)
{
    let currentRowID = "#row-" + rowToEdit.toString();
    let currentRow = document.querySelector(currentRowID);

    currentRow.children[0].innerHTML = expense.name;
    currentRow.children[1].innerHTML = expense.date;
    currentRow.children[2].innerHTML = expense.amount;
}


/*
 * This is the callback function for the form submission event. It gets
 * the data from the form, creates a new row in the table, adds the data
 * to the row, and resets the form.
 */
function addExpense(event)
{
    // stop default form submission
    //event.preventDefault();


    if(!validateForm(event))
    {
        alert("Form must be filled out.");
        return;
    }

    // get the data from the form
    let expense_name = document.querySelector('#expense-name').value;
    let expense_date = document.querySelector("#date").value;
    let expense_amount = document.querySelector("#amount").value;

    const expense = {
        name: expense_name,
        date: expense_date,
        amount: expense_amount
    };


    /*
     * Check if expense has just been added and if so
     * remove it from the added dict. Should do this for
     * remove also.
     */
    if(editing)
    {
        expenses.expenses[expenses.rowToEdit] = expense;

        if(expenses.rowToEdit in expenses.rowsAdded) {
            delete expenses.rowsAdded[expenses.rowToEdit];
        }

        if(!(expenses.rowToEdit in expenses.rowsEdited)) {
            expenses.rowsEdited[expenses.rowToEdit] = true;
        }

        modifyExistingRow(expense);
        expenses.editing = false;
        expenses.rowToEdit = 0;
    }

    else
    {
        expenses.expenses[expenses.nextExpenseNumber] = expense;
        expenses.added.push(expenses.nextExpenseNumber);
        addNewRow(expense)
        expenses.numExpenses++;
        expenses.nextExpenseNumber++;
    }

    let expenseForm = document.querySelector('#expense-form');
    let expenseFormDiv = document.querySelector('#expense-form-div');

    hideForm(expenseForm, expenseFormDiv);
}



function isDescendent(domElement, ancestorElement)
{
    let currentNode = domElement;

    while(currentNode != null)
    {
        if(currentNode == ancestorElement)
        {
            return true;
        }
        //console.log(currentNode);
        currentNode = currentNode.parentElement;
    }

    return false;
}



function addButtonClicked(event)
{
    let input_form = document.querySelector('#expense-form-div');
    
    displayForm(input_form);
}

function exitButtonClicked(event)
{
    let input_form_div = document.querySelector('#expense-form-div');
    let input_form = document.querySelector('#expense-form');

    hideForm(input_form, input_form_div);
}


function loadDatabase(databaseName)
{
    let db = null;
    let objectStore = null;

    const connection = indexedDB.open(databaseName);

    connection.onsuccess = (event) => {
        db = connection.result;

        if(!db.objectStoreNames.contains("temp_expenses")) {
            objectStore = db.createObjectStore("temp_expenses");
            expenses.editing = false;
            expenses.nextExpenseNumber = 0;
            expenses.numExpenses = 0;
            return;
        }

        else {
            objectStore = db.transaction('temp_expenses', 'readwrite').objectStore('temp_expenses');
        }

        let records = objectStore.getAll();

        records.onsuccess = (event) => {
            expenses.editing = false;
            expenses.nextExpenseNumber = 0;
            expenses.numExpenses = records.result.length;

            for(let i = 0; i < records.result.length; i++) {
                expenses.expenses[records.result[i].key] = (records.result[i].value);
                addNewRow(records.result[i].value);

                if(records.result[i].key > expenses.nextExpenseNumber)
                {
                    expenses.nextExpenseNumber = records.result[i].key;
                }
            }
            
        }


    };

    connection.onupgradeneeded = (event) => {

    };

    connection.onerror = (event) => {

    };

    db.close();

    //return results;
}

function commitToDatabase(database)
{
    let db = null;
    let objectStore = null;

    let connection = indexedDB.open(database);

    connection.onsuccess = (event) => {
        db = connection.result;

        if(!db.objectStoreNames.contains('temp_expenses')) {
            objectStore = db.createObjectStore('temp_expenses');
        }

        else {
            objectStore = db.transaction('temp_expenses', 'readwrite').objectStore('temp_expenses');
        }

        for(let i = 0; i < expenses.rowsEdited.length; i++) {
            let req = objectStore.openCursor(expenses.rowsEdited[i]);

            req.onsuccess = function(e) {
                var cursor = e.target.result; 
                if (cursor) { // key already exist
                    cursor.update(expenses.expenses[expenses.rowsEdited[i]]);
                } else { // key not exist
                    objectStore.add(expenses.expenses[expenses.rowsEdited[i]], expenses.rowsEdited[i]);
                }
            };
            
        }

        for(let i = 0; i < expenses.rowsAdded.length; i++) {
            objectStore.add(expenses.expenses[expenses.rowsAdded[i]], expenses.rowsAdded[i]);
        }

        for(let i = 0; i < expenses.rowsRemoved.length; i++) {
            let req = objectStore.openCursor(expenses.rowsRemoved[i]);

            req.onsuccess = function(e) {
                var cursor = e.target.result; 
                if (cursor) { // key already exist
                    cursor.delete(expenses.rowsEdited[i]);
                }
            };
        }


    }

    db.close();

    expenses.rowsEdited = []
    expenses.rowsAdded = []
    expenses.rowsRemoved = []

    expenses.expenses = {}
}


function flushToServer(database)
{
    let expenses = [];

    //open indexeddb
    // open objectstore
    // for key in objectstore
        // add value to expenses
    //close database

    let xhr = new XMLHttpRequest();

    let endpoint = "/" + 

    xhr.open("POST", );

    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(expenses));
    // XMLHttpRequest
    // fill it out
    // add json data for expenses to it
    // send it
    // wait for response
    // redirect to myexpenses

}


function submitClicked(event)
{
    commitToDatabase("expenses");
    flushToServer("expenses");
}


window.onload = loadDatabase("expenses");
window.onunload = commitToDatabase("expenses");

//document.querySelector('#expense-submit').addEventListener('click', addExpense);
//document.querySelector('#add-button').addEventListener('click', addButtonClicked);
//document.querySelector('#form-exit-button').addEventListener('click', exitButtonClicked);