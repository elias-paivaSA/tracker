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
const characterLength = document.querySelector(".character");
const characterLowercase = document.querySelector(".lowercase");
const characterUppercase = document.querySelector(".uppercase");
const characterNumber = document.querySelector(".character-number");
const characterSpecial = document.querySelector(".special-character");
const spinnerOverlay = document.querySelector(".spinner-overlay");
const footer = document.querySelector("footer");

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{4,12}$/;
  return regex.test(password);
}

passwordInput.addEventListener("keyup", () => {
  console.log("object");
  const value = passwordInput.value;

  const lower = new RegExp("(?=.*[a-z])");
  const upper = new RegExp("(?=.*[A-Z])");
  const number = new RegExp("(?=.*[0-9])");
  const special = new RegExp("(?=.*[!@#$%^&*])");
  const length = new RegExp(/^.{4,12}$/);

  if (lower.test(value)) {
    characterLowercase.classList.add("valid");
  } else {
    characterLowercase.classList.remove("valid");
  }

  if (upper.test(value)) {
    characterUppercase.classList.add("valid");
  } else {
    characterUppercase.classList.remove("valid");
  }

  if (number.test(value)) {
    characterNumber.classList.add("valid");
  } else {
    characterNumber.classList.remove("valid");
  }

  if (special.test(value)) {
    characterSpecial.classList.add("valid");
  } else {
    characterSpecial.classList.remove("valid");
  }

  if (length.test(value)) {
    characterLength.classList.add("valid");
  } else {
    characterLength.classList.remove("valid");
  }
});

eyeClosed.style.display = "none";
eyeClosedTwo.style.display = "none";

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
    const data = {
      username: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
    };

    form.style.display = 'none';
    spinnerOverlay.classList.remove('hidden');

    setTimeout(() => {
      fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Signup failed");
          }
          return response.json();
        })
        .then((result) => {
          if (result.token) {
            localStorage.setItem("token", result.token);
          }
          window.location.href = "/dashboard.html";
        })
        .catch((error) => {
          spinnerOverlay.classList.add('hidden');
          form.style.display = 'block';
          console.error(error);
          alert(error.message || "Something went wrong. Please try again.");
        });
    }, 4000);
  };

  if ( passwordRules.style.display = "block") {
    passwordMessage.style.display = "none";
  }

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

  passwordInput.addEventListener("keyup", function (event) {
    if (event.key === "Tab") {
      passwordRules.style.display = "block";
    }
  });

  passwordInput.addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      passwordRules.style.display = "none";
    }
  });

  document.addEventListener("click", function (event) {
    if (!passwordInput.contains(event.target)) {
      passwordRules.style.display = "none";
    }
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
    console.log("object");
    eyeClosed.style.display = "block";
    passwordInput.type = "text";
  });

  eyeOpenTwo.addEventListener("click", () => {
    eyeClosedTwo.style.display = "block";
    passwordTwoInput.type = "text";
  });

  eyeClosed.addEventListener("click", () => {
    eyeClosed.style.display = "none";
    eyeOpen.style.display = "block";
    passwordInput.type = "password";
  });

  eyeClosedTwo.addEventListener("click", () => {
    eyeClosedTwo.style.display = "none";
    eyeOpenTwo.style.display = "block";
    passwordTwoInput.type = "password";
  });

  passwordInput.addEventListener("keydown", function (event) {
    if (event.tagert === "Tab") {
      console.log("object");
      passwordRules.style.display = "none";
    }
  })});