const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordTwoInput = document.getElementById('passwordTwo');
const buttonCreateAccount = document.querySelector('.login-btn');
const googleBtn = document.querySelector('.google-btn');
const facebookBtn = document.querySelector('.facebook-btn');
const nameMessage = document.querySelector('.name-msg');
const emailMessage = document.querySelector('.email-msg');
const passwordMessage = document.querySelector('.password-msg');
const passwordTwoMessage = document.querySelector('.password-two-msg');

buttonCreateAccount.addEventListener('click', (e) => {
    e.preventDefault();
    if(nameInput.value === "") nameMessage.style.display = 'block'
    if(emailInput.value === "") emailMessage.style.display = 'block';
    if(passwordInput.value === "") passwordMessage.style.display = 'block';
    if(passwordTwoInput.value === "") passwordTwoMessage.style.display = 'block';
}) 

