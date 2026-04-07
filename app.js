const WHATSAPP_URL = "https://chat.whatsapp.com/EDLgOCOg7dACXYFtHRhDIu?mode=gi_t";
const COLLECTION = "equipos";
const MAX_TEAMS = 16;

// CARGAR EQUIPOS EN TIEMPO REAL
function loadTeams() {
  const container = document.getElementById("teamsContainer");

  db.collection(COLLECTION)
    .orderBy("timestamp", "asc")
    .onSnapshot(snapshot => {
      container.innerHTML = "";
      document.getElementById("totalEquipos").textContent = snapshot.size;
      document.getElementById("cuposLibres").textContent = MAX_TEAMS - snapshot.size;

      snapshot.forEach(doc => {
        const data = doc.data();

        const div = document.createElement("div");
        div.className = "team-card";

        div.innerHTML = `
          <h3>${data.teamName}</h3>
          <p>👑 ${data.captain}</p>
          <p>📱 ${data.contact}</p>
          <p>⚔ ${data.players.join(", ")}</p>
        `;

        container.appendChild(div);
      });
    });
}

// REGISTRAR EQUIPO
document.getElementById("registroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const teamName = document.getElementById("teamName").value;
  const captain = document.getElementById("captain").value;
  const contact = document.getElementById("contact").value;

  const players = [
    document.getElementById("p1").value,
    document.getElementById("p2").value,
    document.getElementById("p3").value,
    document.getElementById("p4").value,
    document.getElementById("p5").value
  ];

  if (!teamName || !captain || !contact || players.includes("")) {
    alert("Completa todos los campos");
    return;
  }

  // GUARDAR EN FIREBASE
  await db.collection(COLLECTION).add({
    teamName,
    captain,
    contact,
    players,
    timestamp: new Date()
  });

  alert("Equipo registrado correctamente");

  // REDIRECCIÓN A WHATSAPP
  window.open(WHATSAPP_URL, "_blank");

  document.getElementById("registroForm").reset();
});

// INICIAR
loadTeams();
