
function addexpense(event)
{
    event.preventDefault();
    let expense_name = document.querySelector('#expense-name').value;
    let expense_date = document.querySelector("#date").value;
    let expense_amount = document.querySelector("#amount").value;

    const list_item = document.createElement("li");
    const text = expense_name + ": " + expense_date + "\t" + expense_amount.toString();
    const text_content = document.createTextNode(text);
    list_item.appendChild(text_content);

    let expense_list = document.querySelector("#display-list");
    expense_list.appendChild(list_item);

    let input_form = document.querySelector('form');
    input_form.reset();
}


document.querySelector('form').addEventListener('submit', addexpense)