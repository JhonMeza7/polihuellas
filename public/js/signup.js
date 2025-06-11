document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    const msg = document.getElementById("mensaje");

    if (response.ok) {
      msg.style.color = "green";
        window.location.href = "/login.html";
    } else {
      msg.style.color = "red";
      msg.textContent = data.error || "Error al registrar.";
    }
  } catch (err) {
    console.error(err);
  }
});
