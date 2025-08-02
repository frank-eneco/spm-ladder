// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTfDaYZ5e7frfkVQpnJS460a5_xOI2cwA",
  authDomain: "spm-ladder.firebaseapp.com",
  projectId: "spm-ladder",
  storageBucket: "spm-ladder.firebasestorage.app",
  messagingSenderId: "164520026060",
  appId: "1:164520026060:web:a68ce945f128bec4b38769"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const ladderRef = db.ref("ladder");

const ladderEl = document.getElementById("ladder");
const playerInput = document.getElementById("playerInput");
const addButton = document.getElementById("addButton");
const resetButton = document.getElementById("resetButton");

let currentLadder = [];

// Render the ladder UI
function renderLadder(players) {
  ladderEl.innerHTML = "";
  players.forEach((player, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-gray-100 px-4 py-2 rounded";
    li.innerHTML = `
      <span>${index + 1}. ${player}</span>
      <div class="space-x-2">
        ${index > 0 ? `<button onclick="moveUp(${index})" class="text-blue-600">↑</button>` : ""}
        ${index < players.length - 1 ? `<button onclick="moveDown(${index})" class="text-blue-600">↓</button>` : ""}
        <button onclick="removePlayer(${index})" class="text-red-600">✖</button>
      </div>
    `;
    ladderEl.appendChild(li);
  });
}

// Push the ladder to Firebase
function updateLadder() {
  ladderRef.set(currentLadder);
}

// Actions
function addPlayer() {
  const name = playerInput.value.trim();
  if (name) {
    currentLadder.push(name);
    playerInput.value = "";
    updateLadder();
  }
}

function removePlayer(index) {
  currentLadder.splice(index, 1);
  updateLadder();
}

function moveUp(index) {
  [currentLadder[index - 1], currentLadder[index]] = [currentLadder[index], currentLadder[index - 1]];
  updateLadder();
}

function moveDown(index) {
  [currentLadder[index], currentLadder[index + 1]] = [currentLadder[index + 1], currentLadder[index]];
  updateLadder();
}

function resetLadder() {
  if (confirm("Are you sure you want to reset the ladder?")) {
    currentLadder = [];
    updateLadder();
  }
}

// Sync ladder from Firebase
ladderRef.on("value", (snapshot) => {
  currentLadder = snapshot.val() || [];
  renderLadder(currentLadder);
});

// Button event listeners
addButton.addEventListener("click", addPlayer);
resetButton.addEventListener("click", resetLadder);

// Expose for inline handlers
window.moveUp = moveUp;
window.moveDown = moveDown;
window.removePlayer = removePlayer;
