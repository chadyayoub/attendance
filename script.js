// ===== Names List =====
const g1 = [
  { name: "AA", team: "T2", group: "G1" },
  { name: "Carbz", team: "T4", group: "G1" },
  { name: "Celine AC", team: "T1", group: "G1" },
  { name: "Chady", team: "T4", group: "G1" },
  { name: "Christelle", team: "T2", group: "G1" },
  { name: "Christy", team: "", group: "G1" },
  { name: "Cinderella", team: "T1", group: "G1" },
  { name: "Clara", team: "T3", group: "G1" },
  { name: "Claude", team: "T4", group: "G1" },
  { name: "EG", team: "T4", group: "G1" },
  { name: "Elias S", team: "T1", group: "G1" },
  { name: "Elie Keyrouz", team: "T2", group: "G1" },
  { name: "Elie Khoury", team: "T3", group: "G1" },
  { name: "Georgina", team: "T1", group: "G1" },
  { name: "Helena", team: "T3", group: "G1" },
  { name: "Jean", team: "T3", group: "G1" },
  { name: "John", team: "T4", group: "G1" },
  { name: "Karen", team: "T1", group: "G1" },
  { name: "Laeticia", team: "T2", group: "G1" },
  { name: "Lara", team: "T3", group: "G1" },
  { name: "Lynn R", team: "T2", group: "G1" },
  { name: "Maria D", team: "T2", group: "G1" },
  { name: "Mariam", team: "T1", group: "G1" },
  { name: "Marie Josée", team: "T2", group: "G1" },
  { name: "Mario", team: "T3", group: "G1" },
  { name: "Markella", team: "T1", group: "G1" },
  { name: "Marylin", team: "T1", group: "G1" },
  { name: "May", team: "T4", group: "G1" },
  { name: "Raphael", team: "T1", group: "G1" },
  { name: "Rebeka", team: "T3", group: "G1" },
  { name: "Reine", team: "T4", group: "G1" },
  { name: "Tonia", team: "T3", group: "G1" },
  { name: "Yara", team: "T2", group: "G1" }
];

const g8 = [
  {name: "Pierre", team: "G8", group: "G8"},
  // T1
  { name: "Elissa", team: "T1", group: "G8" },
  { name: "Hiba", team: "T1", group: "G8" },
  { name: "Mario", team: "T1", group: "G8" },
  { name: "Pascal", team: "T1", group: "G8" },
  { name: "Chady", team: "T1", group: "G8" },
  // T2
  { name: "Hayat", team: "T2", group: "G8" },
  { name: "Tony", team: "T2", group: "G8" },
  { name: "Tonia", team: "T2", group: "G8" },
  { name: "Myriam", team: "T2", group: "G8" },
  { name: "Elio", team: "T2", group: "G8" },
  { name: "Carmen", team: "T2", group: "G8" },
  // T3
  { name: "Rita H", team: "T3", group: "G8" },
  { name: "Joelle N", team: "T3", group: "G8" },
  { name: "Lewis", team: "T3", group: "G8" },
  { name: "Cynthia", team: "T3", group: "G8" },
  { name: "Nour", team: "T3", group: "G8" },
  { name: "Alessandro", team: "T3", group: "G8" },
  // T4
  { name: "Rita M", team: "T4", group: "G8" },
  { name: "Sandy", team: "T4", group: "G8" },
  { name: "Engy", team: "T4", group: "G8" },
  { name: "Merna", team: "T4", group: "G8" },
  { name: "Mamdouh", team: "T4", group: "G8" },
  { name: "Fady", team: "T4", group: "G8" },
  { name: "Madone", team: "T4", group: "G8" },
  { name: "Simone", team: "T4", group: "G8" }
];

// Combined data
const allPeople = [...g1, ...g8];

// ===== localStorage Helpers =====
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}

function getFromStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value;
  } catch (err) {
    console.error("Failed to get from localStorage:", err);
    return null;
  }
}

// Load saved group from localStorage or default to G1
const savedGroup = getFromStorage("selectedGroup") || "G1";

let selectedTeam = "ALL";
let selectedGroup = savedGroup;
let selectedNames = [];

const tableBody = document.querySelector("#attendance-table tbody");
const groupDropdown = document.getElementById("group-dropdown");
const teamDropdown = document.getElementById("team-dropdown");

// Set dropdown to saved value
groupDropdown.value = savedGroup;

// Function to render table based on group and team filters
function renderTable() {
  // Clear existing rows
  tableBody.innerHTML = "";
  
  // Filter people based on group first
  let filteredPeople = allPeople.filter(person => person.group === selectedGroup);
  
  // Then filter by team if not "ALL"
  if (selectedTeam !== "ALL") {
    filteredPeople = filteredPeople.filter(person => person.team === selectedTeam);
  }
  
  // Sort alphabetically by name (ascending)
  filteredPeople.sort((a, b) => a.name.localeCompare(b.name));
  
  // Update selectedNames
  selectedNames = filteredPeople.map(person => person.name);
  
  // Render rows
  selectedNames.forEach((name) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="name-cell">${name}</td>
      <td class="checkbox-cell">
        <label class="checkbox-wrapper">
          <input type="checkbox" class="online-checkbox" />
          <span class="checkbox-fill" aria-hidden="true"></span>
        </label>
      </td>
      <td class="checkbox-cell">
        <label class="checkbox-wrapper">
          <input type="checkbox" class="cam-checkbox" />
          <span class="checkbox-fill" aria-hidden="true"></span>
        </label>
      </td>
      <td class="checkbox-cell">
        <label class="checkbox-wrapper">
          <input type="checkbox" class="physical-checkbox" />
          <span class="checkbox-fill" aria-hidden="true"></span>
        </label>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Initial render
renderTable();

// Group dropdown change event
groupDropdown.addEventListener("change", (e) => {
  selectedGroup = e.target.value;
  saveToStorage("selectedGroup", selectedGroup);
  renderTable();
});

// Team dropdown change event
teamDropdown.addEventListener("change", (e) => {
  selectedTeam = e.target.value;
  renderTable();
});

// ===== Checkbox Linking Logic =====
tableBody.addEventListener("change", (e) => {
  const row = e.target.closest("tr");
  if (!row) return;

  const online = row.querySelector(".online-checkbox");
  const cam = row.querySelector(".cam-checkbox");
  const physical = row.querySelector(".physical-checkbox");

  // Checking Online unchecks Physical
  if (e.target === online && online.checked) {
    physical.checked = false;
  }

  // Unchecking Online unchecks Cam
  if (e.target === online && !online.checked) {
    cam.checked = false;
  }

  // Checking Cam auto-checks Online and unchecks Physical
  if (e.target === cam && cam.checked) {
    online.checked = true;
    physical.checked = false;
  }

  // Checking Physical unchecks Online and Cam
  if (e.target === physical && physical.checked) {
    online.checked = false;
    cam.checked = false;
  }
});

// ===== Time Selection =====
const timeCheckboxes = document.querySelectorAll(".time-checkbox");

timeCheckboxes.forEach((cb) => {
  cb.addEventListener("change", (e) => {
    if (e.target.checked) {
      timeCheckboxes.forEach((other) => {
        if (other !== e.target) other.checked = false;
      });
    }
  });
});

// ===== Report Button =====
const reportBtn = document.getElementById("report-btn");
const meetingInput = document.getElementById("meeting-name");

reportBtn.addEventListener("click", async () => {
  const meetingName = meetingInput.value.trim();
  const selectedTime = Array.from(timeCheckboxes).find(cb => cb.checked)?.value || null;

  if (!meetingName) {
    meetingInput.classList.add("error");
    meetingInput.placeholder = "Please enter a meeting name";
    meetingInput.focus();
    return;
  }

  meetingInput.classList.remove("error");

  const physicalNames = [];
  const onlineNames = [];
  const absentNames = [];

  document.querySelectorAll("#attendance-table tbody tr").forEach((row) => {
    const name = row.querySelector(".name-cell").textContent;
    const online = row.querySelector(".online-checkbox").checked;
    const cam = row.querySelector(".cam-checkbox").checked;
    const physical = row.querySelector(".physical-checkbox").checked;

    if (physical) physicalNames.push(`✅ ${name}`);
    else if (online) {
      onlineNames.push(cam ? `✅ 📸 ${name}` : `✅ ${name}`);
    } else {
      absentNames.push(`- ${name}`);
    }
  });

  const now = new Date();
  const yearOffset = now.getFullYear() - 1983;
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const formattedDate = `${yearOffset}${month}${day}`;

  let report = "";

  if (selectedTime) {
    if (selectedTime === "10AM" || selectedTime === "11:40AM") {
      report += `**${meetingName} ${formattedDate}**\n\n`;
    } else {
      report += "\n";
    }
  } else {
    report += `**${meetingName} ${formattedDate}**\n\n`;
  }

  if (physicalNames.length) {
    if(selectedTime) report += `**${selectedTime}**\n`;
    report += `**Physical:**\n${physicalNames.join("\n")}\n\n`;
  }

  if (onlineNames.length) {
    if(selectedTime) report += `**${selectedTime}**\n`;
    if(physicalNames.length) report += "**Online:**\n";
    report += `${onlineNames.join("\n")}\n\n`;
  }

  if (absentNames.length) {
    if(!selectedTime || (selectedTime !== "5PM" && selectedTime !== "6PM" && selectedTime !== "10PM"))
      report += `${absentNames.join("\n")}`;
  }

  try {
    await navigator.clipboard.writeText(report);

    const message = document.createElement("div");
    message.textContent = "✅ Report copied to clipboard";
    message.className = "copy-notice";
    document.body.appendChild(message);

    setTimeout(() => message.remove(), 2500);
  } catch (err) {
    alert("❌ Failed to copy report to clipboard.");
    console.error(err);
  }
});

meetingInput.addEventListener("input", () => {
  meetingInput.classList.remove("error");
});
