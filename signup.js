const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordTwoInput = document.getElementById('passwordTwo');
const buttonCreateAccount = document.querySelector('.login-btn');
const googleBtn = document.querySelector('.google-btn');
const facebookBtn = document.querySelector('.facebook-btn');

buttonCreateAccount.addEventListener('click', (e) => {
    e.preventDefault();
    if(nameInput.value === "") {console.log("object");}
    if(emailInput.value === "") {console.log("object");}
    if(passwordInput.value === "") {console.log("object");}
    if(passwordTwoInput.value === "") {console.log("object");}
}) 

