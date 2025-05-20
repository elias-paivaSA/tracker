const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordTwoInput = document.getElementById("passwordTwo");
const buttonCreateAccount = document.querySelector(".login-btn");
const form = document.querySelector("form");
const passwordRules = document.querySelector(".password-rules");
const googleBtn = document.querySelector(".google-btn");
const facebookBtn = document.querySelector(".facebook-btn");
const nameMessage = document.querySelector(".name-msg");
const emailMessageOne = document.querySelector(".email-msg-one");
const emailMessageTwo = document.querySelector(".email-msg-two");
const passwordMessage = document.querySelector(".password-msg");
const passwordTwoMessage = document.querySelector(".password-two-msg");

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  nameMessage.style.display = "none";
  nameInput.style.borderColor = "initial";

  passwordMessage.style.display = "none";
  passwordInput.style.borderColor = "initial";

  passwordTwoMessage.style.display = "none";
  passwordTwoInput.style.borderColor = "initial";

  if (nameInput.value === "") {
    nameMessage.style.display = "block";
    nameInput.style.borderColor = "red";
  }

  if (emailInput.value === "") {
    emailMessageOne.style.display = "block"; // show "required"
    emailInput.style.borderColor = "red";
  } else if (!validateEmail(emailInput.value)) {
    emailMessageTwo.style.display = "block"; // show "invalid"
    emailInput.style.borderColor = "red";
  }

  if (!validateEmail(emailInput.value)) {
    emailMessageTwo.style.display = "block";
  }

  if (passwordInput.value === "") {
    passwordInput.style.borderColor = "red";
    passwordMessage.style.display = "block";
  }

  if (passwordTwoInput.value !== passwordInput.value) {
    passwordTwoMessage.style.display = "block";
    passwordTwoInput.style.borderColor = "red";
  }

  if (passwordTwoInput.value === "") {
    passwordTwoMessage.style.display = "block";
    passwordTwoInput.style.borderColor = "red";
  }
});

passwordInput.addEventListener("click", () => {
  passwordRules.style.display = "block";
});
