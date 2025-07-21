// Firebase config (replace with your own from Firebase Console)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-app.firebaseio.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-id",
  appId: "your-app-id"
};

// Initialize
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const ladderRef = db.ref("ladder");

const ladderEl = document.getElementById("ladder");
const playerInput = document.getElementById("playerInput");

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

// Realtime sync
let currentLadder = [];
ladderRef.on("value", snapshot => {
  currentLadder = snapshot.val() || [];
  renderLadder(currentLadder);
});

function updateLadder() {
  ladderRef.set(currentLadder);
}

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
  [currentLadder[index + 1], currentLadder[index]] = [currentLadder[index], currentLadder[index + 1]];
  updateLadder();
}

function resetLadder() {
  if (confirm("Are you sure you want to reset the ladder?")) {
    currentLadder = [];
    updateLadder();
  }
}

// Expose functions to global scope for HTML onclick
window.addPlayer = addPlayer;
window.removePlayer = removePlayer;
window.moveUp = moveUp;
window.moveDown = moveDown;
window.resetLadder = resetLadder;
