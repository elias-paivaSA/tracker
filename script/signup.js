const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordTwoInput = document.getElementById('passwordTwo');
const buttonCreateAccount = document.querySelector('.login-btn');
const form = document.querySelector("form");
const passwordRules = document.querySelector(".password-rules");
const googleBtn = document.querySelector('.google-btn');
const facebookBtn = document.querySelector('.facebook-btn');
const nameMessage = document.querySelector('.name-msg');
const emailMessage = document.querySelector('.email-msg');
const passwordMessage = document.querySelector('.password-msg');
const passwordTwoMessage = document.querySelector('.password-two-msg');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(nameInput.value === "") {
        nameMessage.style.display = 'block';
        nameInput.style.borderColor = "red";
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email);
    }
    
    if(!validateEmail(emailInput.value)) {
        emailMessage.style.display = 'block';
        emailInput.style.borderColor = "red";
    };

    if(passwordInput.value === "") {
        passwordMessage.style.display = 'block';
    }

    if(passwordInput.value === "") {
        passwordMessage.style.display = 'block';
    }

    if(passwordTwoInput.value !== passwordInput.value ) {
        passwordTwoMessage.style.display = 'block';
        passwordTwoInput.style.borderColor = "red";
    }; 

    if(passwordTwoInput.value === "") {
        passwordTwoMessage.style.display = 'block';
        passwordTwoInput.style.borderColor = "red";
    }; 
}) 

