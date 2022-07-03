

// global variables for keeping track of number of table rows
let numExpenses = 0;



/*
 * This is the callback function for the form submission event. It gets
 * the data from the form, creates a new row in the table, adds the data
 * to the row, and resets the form.
 */
function addexpense(event)
{
    // stop default form submission
    event.preventDefault();

    // get the data from the form
    let expense_name = document.querySelector('#expense-name').value;
    let expense_date = document.querySelector("#date").value;
    let expense_amount = document.querySelector("#amount").value;

    // create new row for table
    const table_row = document.createElement("tr");
    table_row.id = "row-" + numExpenses.toString();

    // create new columns for new table element
    const table_data_name = document.createElement("td");
    const table_data_date = document.createElement("td");
    const table_data_amount = document.createElement("td");
    const table_data_edit_button = document.createElement("td");
    const table_data_remove_button = document.createElement("td");

    // create text content for each column
    const table_name_text = document.createTextNode(expense_name);
    const table_date_text = document.createTextNode(expense_date);
    const table_amount_text = document.createTextNode(expense_amount.toString());

    // add text to table columns
    table_data_name.appendChild(table_name_text);
    table_data_date.appendChild(table_date_text);
    table_data_amount.appendChild(table_amount_text);


    // create edit and remove buttons for each row
    const data_edit = document.createElement("button");
    const data_remove = document.createElement("button");

    // create text content for buttons
    const edit_text = document.createTextNode("Edit");
    const remove_text = document.createTextNode("Remove");

    // add button text nodes to button elements
    data_edit.appendChild(edit_text);
    data_remove.appendChild(remove_text);

    // add class to buttons to allow them to be styled properly
    data_edit.classList.add("table-button");
    data_remove.classList.add("table-button");

    data_edit.addEventListener()

    let data_edit_id = "data-edit-row-" + numExpenses.toString();
    let data_remove_id = "data-remove-row-" + numExpenses.toString();
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

    console.log(numExpenses);
    numExpenses++;

    // reset the form
    let input_form = document.querySelector('form');
    input_form.reset();

    let form_div = document.querySelector('#expense-form');
    form_div.style.display = "none";
}


/*
 * Callback function for when the 'add expense' button is clicked.
 * Displays the expense form.
 */
function display_form(event)
{
    let input_form = document.querySelector('#expense-form');
    input_form.style.display = "block";
    //input_form.style.position = "fixed";
    input_form.style.zIndex = "10";
}


/*
 * Callback function for X button click. Hides the form.
 */
function hide_form(event)
{
    let input_form = document.querySelector('#expense-form');
    input_form.style.display = "none";
}



document.querySelector('form').addEventListener('submit', addexpense);
document.querySelector('#add-button').addEventListener('click', display_form);
document.querySelector('#form-exit-button').addEventListener('click', hide_form);