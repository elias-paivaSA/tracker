const email = document.querySelector("#email");
const password = document.querySelector("#password");
const form = document.querySelector("form");
const loginBtn = document.querySelector(".login-btn");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(password.value, email.value);
 })


 loginBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Login failed');
    } else {
      // Login successful, redirect to dashboard with token
      window.location.href = `/dashboard.html?token=${data.token}`;
    }
  } catch (err) {
    alert('Something went wrong');
  }
});