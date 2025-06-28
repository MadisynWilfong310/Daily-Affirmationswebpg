document.addEventListener("DOMContentLoaded", () => {
  // ——— Daily Affirmations ———
  const affirmations = [
    "I am capable of achieving my goals.",
    /* …etc… */
  ];
  function getRandomAffirmation() {
    return affirmations[Math.floor(Math.random() * affirmations.length)];
  }
  function showRandomAffirmation() {
    const box = document.getElementById("affirmationDisplay");
    box.classList.add("hidden");
    setTimeout(() => {
      box.innerText = getRandomAffirmation();
      box.classList.remove("hidden");
    }, 500);
  }
  document.getElementById("affirmationButton")
          .addEventListener("click", showRandomAffirmation);
  showRandomAffirmation();

  // ——— Favorites ———
  document.getElementById("favoriteBtn")
          .addEventListener("click", () => {
    const fav = document.getElementById("affirmationDisplay").innerText;
    localStorage.setItem("favoriteAffirmation", fav);
    alert("Saved to favorites!");
  });

  // ——— Sticky-Notes Setup ———
  const sidebar = document.getElementById("notes-sidebar");
  let noteCount = 0;

  function createNote(initialText = "") {
    noteCount++;
    // Tab
    const tab = document.createElement("div");
    tab.className = "note-tab";
    tab.title = `Note ${noteCount}`;
    sidebar.insertBefore(tab, document.getElementById("add-note-btn"));

    // Panel
    const panel = document.createElement("div");
    panel.className = "note-panel";
    panel.style.top  = `${50 + noteCount * 5}%`;
    panel.innerHTML = `
      <div class="note-header">
        <span>🗒️ Note ${noteCount}</span>
        <button class="delete-btn">×</button>
      </div>
      <div class="note-content" contenteditable="true">${initialText}</div>
    `;
    document.body.appendChild(panel);

    // Toggle open
    tab.addEventListener("click", () => panel.classList.toggle("open"));

    // Delete = clear content & close
    panel.querySelector(".delete-btn")
         .addEventListener("click", () => {
      panel.querySelector(".note-content").innerText = "";
      panel.classList.remove("open");
    });

    // Drag by header
    const header = panel.querySelector(".note-header");
    header.addEventListener("mousedown", e => {
      e.preventDefault();
      const rect = panel.getBoundingClientRect();
      const offX = e.clientX - rect.left;
      const offY = e.clientY - rect.top;
      function onMove(e) {
        panel.style.left = `${e.clientX - offX}px`;
        panel.style.top  = `${e.clientY - offY}px`;
        panel.style.transform = "none";
      }
      function onUp() {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  }

  // Wire up the “＋” button
  document.getElementById("add-note-btn")
          .addEventListener("click", () => createNote("Type here…"));

  // Start with one note
  createNote("Type here…");
});


// journal.js
const coverBtn = document.getElementById('openJournal');
const closeBtn = document.getElementById('closeJournal');
const cover    = document.getElementById('cover');
const page     = document.getElementById('page');
const saveBtn  = document.getElementById('saveEntry');
const textarea = document.getElementById('journalText');
const list     = document.getElementById('entriesList');
const KEY      = 'reflectionJournalEntries';

function render() {
  const entries = JSON.parse(localStorage.getItem(KEY) || '[]');
  list.innerHTML = entries.map(e =>
    `<li><time>${e.date}</time><p>${e.text}</p></li>`
  ).join('');
}

coverBtn.addEventListener('click', () => {
  cover.classList.add('hidden');
  page.classList.remove('hidden');
  render();
});

closeBtn.addEventListener('click', () => {
  page.classList.add('hidden');
  cover.classList.remove('hidden');
});

saveBtn.addEventListener('click', () => {
  const text = textarea.value.trim();
  if (!text) return alert('Please write something first.');
  const entries = JSON.parse(localStorage.getItem(KEY) || '[]');
  entries.unshift({ date: new Date().toLocaleString(), text });
  localStorage.setItem(KEY, JSON.stringify(entries));
  textarea.value = '';
  render();
});

// In case the user reloads while the page is open:
render();


