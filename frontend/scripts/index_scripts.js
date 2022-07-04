

// global variables for keeping track of number of table rows
let numExpenses = 0;
let nextExpenseNumber = 0;


let rowToEdit = 0;
let editing = false;


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
    editing = true;
    rowToEdit = parseInt(rowNumber);

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

    let input_form = document.querySelector('#expense-form-div');
    input_form.style.display = "block";
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
    let expenseName = row.children[0];
    let expenseDate = row.children[1];
    let expenseAmount = row.children[2];

    const expense = {
        name: expenseName,
        date: expenseDate,
        amount: expenseAmount
    };


    row.remove();
    numExpenses--;

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
    table_row.id = "row-" + nextExpenseNumber.toString();

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

    let data_edit_id = "data-edit-row-" + nextExpenseNumber.toString();
    let data_remove_id = "data-remove-row-" + nextExpenseNumber.toString();
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

    numExpenses++;
    nextExpenseNumber++;
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
function addexpense(event)
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

    if(editing)
    {
        modifyExistingRow(expense);
        editing = false;
    }

    else
    {
        addNewRow(expense)
    }

    // reset the form
    let input_form = document.querySelector('#expense-form');
    input_form.reset();

    let form_div = document.querySelector('#expense-form-div');
    form_div.style.display = "none";
}


/*
 * Callback function for when the 'add expense' button is clicked.
 * Displays the expense form.
 */
function display_form(event)
{
    let input_form = document.querySelector('#expense-form-div');
    input_form.style.display = "block";
    //input_form.style.position = "fixed";
    //input_form.style.zIndex = "10";
}


/*
 * Callback function for X button click. Hides the form.
 */
function hide_form(event)
{
    let input_form = document.querySelector('#expense-form-div');
    input_form.style.display = "none";
}



document.querySelector('#expense-submit').addEventListener('click', addexpense);
document.querySelector('#add-button').addEventListener('click', display_form);
document.querySelector('#form-exit-button').addEventListener('click', hide_form);