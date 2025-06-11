document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    const msg = document.getElementById("mensaje");

    if (response.ok) {
      msg.style.color = "green";
      msg.textContent = "¡Login exitoso!";
      sessionStorage.setItem("token", data.token);
      window.location.href = "/menu.html"; // redirige a pantalla principal
    } else {
      msg.style.color = "red";
      msg.textContent = data.error || "Credenciales incorrectas";
    }
  } catch (err) {
    console.error(err);
  }
});
