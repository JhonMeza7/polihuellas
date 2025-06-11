const token = sessionStorage.getItem("token");
const params = new URLSearchParams(window.location.search);
const modo = params.get("modo"); // "ver" o "subir"

if (!token) window.location.href = "/login.html";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

// Cerrar sesión
function logout() {
  sessionStorage.removeItem("token");
  window.location.href = "/login.html";
}

// Registrar mascota
document.getElementById("petForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const idEditing = e.target.dataset.editing;
  const body = {
    name: document.getElementById("name").value,
    species: document.getElementById("species").value,
    age: document.getElementById("age").value,
    description: document.getElementById("description").value,
    imageUrl: document.getElementById("imageUrl").value,
  };

  const url = idEditing ? `/api/pets/${idEditing}` : "/api/pets";
  const method = idEditing ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  });

  if (res.ok) {
    alert(idEditing ? "Mascota actualizada" : "Mascota registrada");
    e.target.reset();
    delete e.target.dataset.editing;
    loadPets();
  } else {
    alert("Error al guardar");
  }
});


async function loadPets() {
  const res = await fetch("/api/pets", { headers });
  const pets = await res.json();

  const myId = parseJwt(token).id;

  const myPets = pets.filter((p) => getOwnerId(p) === myId);
  const others = pets.filter((p) => getOwnerId(p) !== myId);

  function getOwnerId(pet) {
    return typeof pet.owner === "string" ? pet.owner : pet.owner._id;
  }

  renderPets("myPets", myPets, true);
  renderPets("availablePets", others, false);
}

function renderPets(containerId, pets, own = false) {
  const div = document.getElementById(containerId);
  div.innerHTML = "";
  pets.forEach((pet) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <h4>${pet.name} (${pet.species})</h4>
      <p>${pet.description || ""}</p>
      <img src="${pet.imageUrl}" width="100" />
      ${
        own
          ? `
          <button onclick="editarPet('${pet._id}')">✏️ Editar</button>
          <button onclick="deletePet('${pet._id}')">🗑️ Eliminar</button>
          `
          : `<button onclick="likePet('${pet._id}')">💖 Adoptar</button>`
      }
      <hr />
    `;
    div.appendChild(card);
  });
}

async function deletePet(id) {
  if (confirm("¿Seguro que deseas eliminar esta mascota?")) {
    await fetch(`/api/pets/${id}`, { method: "DELETE", headers });
    loadPets();
  }
}
async function editarPet(id) {
  const res = await fetch(`/api/pets`, { headers });
  const pets = await res.json();
  const pet = pets.find(p => p._id === id);
  if (!pet) return alert("Mascota no encontrada");

  // Rellenar el formulario
  document.getElementById("name").value = pet.name;
  document.getElementById("species").value = pet.species;
  document.getElementById("age").value = pet.age;
  document.getElementById("description").value = pet.description;
  document.getElementById("imageUrl").value = pet.imageUrl;

  // Guardar referencia del ID
  document.getElementById("petForm").dataset.editing = id;
}


async function likePet(id) {
  await fetch(`/api/pets/${id}/like`, { method: "POST", headers });
  alert("¡Le diste like a esta mascota!");
}

function parseJwt(token) {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

loadPets();

async function cargarLikesRecibidos() {
  const res = await fetch("/api/pets/likes/recibidos", { headers });
  const data = await res.json();
  const div = document.getElementById("likesRecibidos");
  div.innerHTML = "";

  const myId = parseJwt(token).id;

  for (const pet of data) {
    const block = document.createElement("div");
    block.innerHTML = `<h4>${pet.petName}</h4>`;

    for (const user of pet.interesados) {
      const yaExiste = await verificarChatExistente(user.id);

      const p = document.createElement("p");
      if (yaExiste) {
        p.innerHTML = `
          ${user.username} (${user.email})
          
        `;
      } else {
        p.innerHTML = `
          ${user.username} (${user.email})
          <button onclick="aceptarMatch('${pet.petId}', '${user.id}')">Aceptar Match</button>
        `;
      }
      block.appendChild(p);
    }

    div.appendChild(block);
  }
}
function abrirChatCon(userId) {
  window.location.href = `/chat.html?match=${userId}`;
}
async function cargarChats() {
  const res = await fetch("/api/chats", { headers });
  const chats = await res.json();
  const select = document.getElementById("chatSelect");
  select.innerHTML = "";

  const parsed = parseJwt(token);
  username = parsed.username || parsed.email || "User";

  chats.forEach((chat) => {
    const otherUser = chat.users.find((u) => u._id !== parsed.id);
    const opt = document.createElement("option");
    opt.value = chat._id;
    opt.text = otherUser.username || "Usuario";
    select.appendChild(opt);
  });

  // Si viene un ID por query string ?match=<userId>, seleccionamos automáticamente
  const matchId = new URLSearchParams(window.location.search).get("match");
  if (matchId) {
    const matchChat = chats.find((chat) =>
      chat.users.some((u) => u._id === matchId)
    );
    if (matchChat) {
      select.value = matchChat._id;
    }
  }

  select.dispatchEvent(new Event("change"));
}

async function verificarChatExistente(interesadoId) {
  const res = await fetch("/api/chats", { headers });
  const chats = await res.json();

  const myId = parseJwt(token).id;

  return chats.some(
    (chat) =>
      chat.users.some((u) => u._id === interesadoId) &&
      chat.users.some((u) => u._id === myId)
  );
}

async function aceptarMatch(petId, interesadoId) {
  const res = await fetch("/api/chats/aceptar-match", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ petId, interesadoId }),
  });

  const msg = await res.json();
  alert(msg.message || "Match procesado");
  cargarLikesRecibidos();
}

cargarLikesRecibidos();
// Ya después de cargar mascotas, renderizar likes, etc.
if (modo === "subir") {
  const form = document.getElementById("formularioMascota");
  form?.scrollIntoView({ behavior: "smooth" });
  form?.classList.add("resaltar");
}
const seccionVer = document.getElementById("seccion-ver");
const seccionSubir = document.getElementById("seccion-subir");
const seccionChats = document.getElementById("seccion-chats");

if (modo === "ver") {
  seccionSubir.style.display = "none";
  seccionVer.style.display = "block";
  seccionChats.style.display = "block";
  cargarChats(); // 💬 cargar chats también en modo "ver"
} else if (modo === "subir") {
  seccionSubir.style.display = "block";
  seccionVer.style.display = "none";
  seccionChats.style.display = "block";
  cargarChats(); // 💬 cargar chats en modo "subir"
}
document.getElementById("btnIrChat").addEventListener("click", () => {
  const chatSelect = document.getElementById("chatSelect");
  const roomId = chatSelect.value;

  if (roomId) {
    // Redirige al chat con el ID del match en la URL
    window.location.href = `/chat.html?match=${roomId}`;
  } else {
    alert("Selecciona un chat primero.");
  }
});
