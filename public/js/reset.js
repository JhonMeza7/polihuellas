// Limpiar sesión si alguien llega logueado
sessionStorage.removeItem("token");
document.getElementById("resetForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const newPassword = document.getElementById("newPassword").value;

  try {
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();
    const msg = document.getElementById("mensaje");

    if (res.ok) {
      if (res.ok) {
        msg.style.color = "green";
          window.location.href = "/login.html";
      }
    } else {
      msg.style.color = "red";
      msg.textContent = data.error || "Error al restablecer contraseña.";
    }
  } catch (err) {
    console.error(err);
  }
});
