const token = sessionStorage.getItem("token");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};
if (!token) window.location.href = "/login.html";

const socket = io();
let currentRoomId = null;
let username = "";

async function cargarChats() {
  const res = await fetch("/api/chats", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const chats = await res.json();
  const select = document.getElementById("chatSelect");
  select.innerHTML = "";

  if (chats.length === 0) {
    select.innerHTML = "<option disabled>No tienes matches aún 😿</option>";
    return;
  }

  const parsed = parseJwt(token);
  username = parsed.username || parsed.email || "User";
  const myId = parsed.id;

  chats.forEach(chat => {
    const otherUser = chat.users.find(u => u._id !== myId);
    const opt = document.createElement("option");
    opt.value = chat._id;
    opt.text = otherUser.username || "Usuario";
    select.appendChild(opt);
  });

  select.addEventListener("change", async () => {
    currentRoomId = select.value;
    document.getElementById("mensajes").innerHTML = "";
    socket.emit("joinRoom", { roomId: currentRoomId, username });
    await cargarHistorial(currentRoomId); // 👈 aquí se carga historial
  });

  // Selecciona el primero automáticamente
  select.selectedIndex = 0;
  select.dispatchEvent(new Event("change"));
}


function enviarMensaje() {
  const input = document.getElementById("mensaje");
  const text = input.value.trim();
  if (text && currentRoomId) {
    socket.emit("mensajePrivado", {
      roomId: currentRoomId,
      senderId: parseJwt(token).id, // 👈 aquí está el ID real
      text,
    });
    input.value = "";
  }
}

async function cargarHistorial(roomId) {
  const res = await fetch(`/api/chats/${roomId}/mensajes`, { headers });
  const mensajes = await res.json();

  const msgDiv = document.getElementById("mensajes");
  msgDiv.innerHTML = "";
  mensajes.forEach(m => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${m.sender?.username || "Anon"}:</strong> ${m.text}`;
    msgDiv.appendChild(p);
  });
}

socket.on("mensajePrivado", (data) => {
  const msgDiv = document.getElementById("mensajes");
  const msg = document.createElement("p");
  msg.innerHTML = `<strong>${data.username}:</strong> ${data.text}`;
  msgDiv.appendChild(msg);
  msgDiv.scrollTop = msgDiv.scrollHeight;
});

function parseJwt(token) {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

cargarChats();
