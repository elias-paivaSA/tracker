const email = document.querySelector("#email");
const password = document.querySelector("#password");
const form = document.querySelector("form");

console.log(form);

form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(password.value, email.value);
 })
