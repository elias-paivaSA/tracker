// This works
//removes form, no seconds
 
 if (isValid) {
    form.style.display = 'none';
    spinnerOverlay.classList.remove("hidden");

    // Prepare the data object to send
    const data = {
      username: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
    };

    // Send data with fetch to your backend route
    fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          // Backend returned an error status, parse message
          const errorData = await response.json();
          throw new Error(errorData.message || "Signup failed");
        }
        return response.json();
      })
      .then((result) => {
        form.reset();
        if (result.token) {
          localStorage.setItem("token", result.token);
          window.location.href = "/dashboard.html";
        }
      });
  }
});



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
  }, 2000);
}