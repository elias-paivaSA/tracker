const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordTwoInput = document.getElementById("passwordTwo");
const buttonCreateAccount = document.querySelector(".login-btn");
const form = document.querySelector("form");
const passwordRules = document.querySelector(".password-rules");
const googleBtn = document.querySelector(".google-btn");
const eyeOpen = document.querySelector(".img-two");
const eyeClosed = document.querySelector(".img-three");
const eyeOpenTwo = document.querySelector(".img-two-eye-open");
const eyeClosedTwo = document.querySelector(".img-three-eye-closed");
const facebookBtn = document.querySelector(".facebook-btn");
const nameMessage = document.querySelector(".name-msg");
const emailMessageOne = document.querySelector(".email-msg-one");
const emailMessageTwo = document.querySelector(".email-msg-two");
const passwordMessage = document.querySelector(".password-msg");
const passwordTwoMessage = document.querySelector(".password-two-msg");
const footer = document.querySelector("footer");

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{4,12}$/;
  return regex.test(password);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let isValid = true;

  nameMessage.style.display = "none";
  nameInput.style.borderColor = "initial";

  emailMessageOne.style.display = "none";
  emailMessageTwo.style.display = "none";
  emailInput.style.borderColor = "initial";


  passwordMessage.style.display = "none";
  passwordInput.style.borderColor = "initial";
  passwordTwoMessage.style.display = "none";
  passwordTwoInput.style.borderColor = "initial";

  passwordRules.style.display = "none";

  if (nameInput.value.trim() === "") {
    nameMessage.style.display = "block";
    nameInput.style.borderColor = "red";
    isValid = false;
  }

  if (emailInput.value.trim() === "") {
    emailMessageOne.style.display = "block";
    emailInput.style.borderColor = "red";
    isValid = false;
  } else if (!validateEmail(emailInput.value)) { 
    emailInput.style.borderColor = "red";
    isValid = false;
  }

    // Password validation - check empty first
  if (passwordInput.value.trim() === "") {
    passwordMessage.style.display = "block";
    passwordInput.style.borderColor = "red";
    isValid = false;
  } else if (!validatePassword(passwordInput.value)) {
    // Show password rules if password invalid
    passwordRules.style.display = "block";
    passwordInput.style.borderColor = "red";
    isValid = false;
  }

  // Confirm password validation
  if (passwordTwoInput.value.trim() === "") {
    passwordTwoMessage.textContent = "Please confirm your password";
    passwordTwoMessage.style.display = "block";
    passwordTwoInput.style.borderColor = "red";
    isValid = false;
  } else if (passwordTwoInput.value !== passwordInput.value) {
    passwordTwoMessage.textContent = "Passwords do not match";
    passwordTwoMessage.style.display = "block";
    passwordTwoInput.style.borderColor = "red";
    isValid = false;
  }

   // Submit if all valid
  if (isValid) {
    form.submit();
  }
});

nameInput.addEventListener("click", () => {
  nameMessage.style.display = "none";
  nameInput.style.borderColor = "initial";
});

emailInput.addEventListener("click", () => {
  emailMessageOne.style.display = "none";
  emailInput.style.borderColor = "initial";
});

passwordInput.addEventListener("click", () => {
  passwordRules.style.display = "block";
  passwordInput.style.borderColor = "initial";
});

passwordTwoInput.addEventListener("click", () => {
  passwordTwoMessage.style.display = "none";
  passwordTwoInput.style.borderColor = "initial";
});

passwordInput.addEventListener("keyup", () => {
  if (passwordInput.value.trim() !== "") {
    eyeClosed.style.display = "none";
    }

});

passwordTwoInput.addEventListener("keyup", () => {
  if (passwordTwoInput.value.trim() !== "") {
    eyeClosedTwo.style.display = "none";
    }
});

eyeOpen.addEventListener("click", () => {
  eyeClosed.style.display = "block";
  passwordInput.type="text";
});

eyeOpenTwo.addEventListener("click", () => {
    eyeClosedTwo.style.display = "block";
    passwordTwoInput.type="text"; 
});

eyeClosed.addEventListener("click", () => {
    eyeOpen.style.display = "block";
    passwordTwoInput.type="password"; 
});

eyeClosedTwo.addEventListener("click", () => {
    eyeOpenTwo.style.display = "block";
    passwordTwoInput.type="password"; 
});