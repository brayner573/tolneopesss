const WHATSAPP_URL = "https://chat.whatsapp.com/EDLgOCOg7dACXYFtHRhDIu?mode=gi_t";
const COLLECTION = "equipos";
const MAX_TEAMS = 16;

const form = document.getElementById("registroForm");
const container = document.getElementById("teamsContainer");
const totalEl = document.getElementById("totalEquipos");
const cuposEl = document.getElementById("cuposLibres");

// MENSAJE BONITO
function showMessage(text, color = "green") {
  let msg = document.getElementById("msg");

  if (!msg) {
    msg = document.createElement("div");
    msg.id = "msg";
    document.body.appendChild(msg);
  }

  msg.innerText = text;
  msg.style.background = color;
  msg.style.position = "fixed";
  msg.style.bottom = "20px";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.padding = "10px 20px";
  msg.style.color = "white";
  msg.style.borderRadius = "5px";
  msg.style.zIndex = "9999";

  setTimeout(() => msg.remove(), 3000);
}

// CARGAR EQUIPOS EN TIEMPO REAL
function loadTeams() {
  db.collection(COLLECTION)
    .orderBy("timestamp", "asc")
    .onSnapshot(snapshot => {

      container.innerHTML = "";

      totalEl.textContent = snapshot.size;
      cuposEl.textContent = MAX_TEAMS - snapshot.size;

      if (snapshot.empty) {
        container.innerHTML = "<p>No hay equipos aún ⚔</p>";
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();

        const div = document.createElement("div");
        div.className = "team-card";

        div.innerHTML = `
          <h3>${data.teamName}</h3>
          <p>👑 ${data.captain}</p>
          <p>📱 ${data.contact}</p>
          <div class="players">
            ${data.players.map(p => `<span>⚔ ${p}</span>`).join("")}
          </div>
        `;

        container.appendChild(div);
      });
    });
}

// REGISTRAR EQUIPO
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const teamName = document.getElementById("teamName").value.trim();
  const captain = document.getElementById("captain").value.trim();
  const contact = document.getElementById("contact").value.trim();

  const players = [
    p1.value.trim(),
    p2.value.trim(),
    p3.value.trim(),
    p4.value.trim(),
    p5.value.trim()
  ];

  // VALIDACIÓN
  if (!teamName || !captain || !contact || players.includes("")) {
    showMessage("⚠ Completa todos los campos", "red");
    return;
  }

  // VALIDAR TELÉFONO
  if (!/^[0-9+ ]+$/.test(contact)) {
    showMessage("⚠ WhatsApp inválido", "red");
    return;
  }

  try {
    // VERIFICAR LÍMITE
    const snap = await db.collection(COLLECTION).get();
    if (snap.size >= MAX_TEAMS) {
      showMessage("🚫 Cupos llenos", "red");
      return;
    }

    // EVITAR DUPLICADOS
    const exist = await db.collection(COLLECTION)
      .where("teamName", "==", teamName)
      .get();

    if (!exist.empty) {
      showMessage("⚠ Ese equipo ya existe", "red");
      return;
    }

    // LOADING
    showMessage("⏳ Registrando...", "blue");

    // GUARDAR
    await db.collection(COLLECTION).add({
      teamName,
      captain,
      contact,
      players,
      timestamp: new Date()
    });

    showMessage("✅ Equipo registrado", "green");

    form.reset();

    // ABRIR WHATSAPP
    setTimeout(() => {
      window.open(WHATSAPP_URL, "_blank");
    }, 1000);

  } catch (error) {
    console.error(error);
    showMessage("❌ Error al guardar", "red");
  }
});

// INICIAR
loadTeams();
