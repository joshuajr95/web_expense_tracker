/* Author: Joshua Jacobs-Rebhun
 * Date: July 10, 2022
 *
 * 
 * This file contains scripts for displaying the login form, and signup form
 * for the home page of the website.
 */



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
    formDiv.style.display = "none";
}


function logButtonClicked(event)
{
    let loginForm = document.querySelector('#login-form-div');

    displayForm(loginForm);
}

function loginExitButtonClicked(event)
{
    let loginFormDiv = document.querySelector('#login-form-div');
    let loginForm = document.querySelector('#login-form');

    hideForm(loginForm, loginFormDiv);
}



function signupButtonClicked(event)
{
    let signupForm = document.querySelector('#signup-form-div');
    
    let loginFormDiv = document.querySelector('#login-form-div');
    let loginForm = document.querySelector('#login-form');

    hideForm(loginForm, loginFormDiv);
    displayForm(signupForm);
}

function signupExitButtonClicked(event)
{
    let signupFormDiv = document.querySelector('#signup-form-div');
    let signupForm = document.querySelector('#signup-form');

    hideForm(signupForm, signupFormDiv);
}




document.querySelector('#log-button').addEventListener('click', logButtonClicked);
document.querySelector('#login-exit-button').addEventListener('click', loginExitButtonClicked);
document.querySelector('#signup-button').addEventListener('click', signupButtonClicked);
document.querySelector('#signup-exit-button').addEventListener('click', signupExitButtonClicked);
