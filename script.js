// ===== Names List =====
const g1 = [
  { name: "AA", team: "T2",  },
  { name: "Carbz", team: "T4", },
  { name: "Celine AC", team: "T1" },
  { name: "Chady", team: "T4"   },
  { name: "Christelle", team: "T2" },
  { name: "Christy", team: "G1" },
  { name: "Cinderella", team: "T1" },
  { name: "Clara", team: "T3" },
  { name: "Claude", team: "T4" },
  { name: "EG", team: "T4" },
  { name: "Elias S", team: "T1" },
  { name: "Elie Keyrouz", team: "T2" },
  { name: "Elie Khoury", team: "T3" },
  { name: "Georgina", team: "T1" },
  { name: "Helena", team: "T3" },
  { name: "Jean", team: "T3" },
  { name: "John", team: "T4" },
  { name: "Karen", team: "T1" },
  { name: "Laeticia", team: "T2" },
  { name: "Lara", team: "T3" },
  { name: "Lynn R", team: "T2" },
  { name: "Maria D", team: "T2" },
  { name: "Mariam", team: "T1" },
  { name: "Marie Josée", team: "T2" },
  { name: "Mario", team: "T3" },
  { name: "Markella", team: "T1" },
  { name: "Marylin", team: "T1" },
  { name: "May", team: "T4" },
  { name: "Raphael", team: "T1" },
  { name: "Rebeka", team: "T3" },
  { name: "Reine", team: "T4" },
  { name: "Tonia", team: "T3" },
  { name: "Yara", team: "T2" }
];

let selectedTeam;
let selectedGroup = "G1";
let selectedNames = [...g1.map(person => person.name)];

const tableBody = document.querySelector("#attendance-table tbody");
const nameDropdown = document.getElementById("name-dropdown");

// Function to render table based on filter
function renderTable(filter = "G1") {
  // Clear existing rows
  tableBody.innerHTML = "";
  
  // Filter people based on selection
  let filteredPeople;
  if (filter === "G1") {
    filteredPeople = g1; // Show all
  } else {
    filteredPeople = g1.filter(person => person.team === filter);
  }
  
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
renderTable("G1");

// Dropdown change event
nameDropdown.addEventListener("change", (e) => {
  const selectedValue = e.target.value;
  
  // Map option values to filter values
  const filterMap = {
    "option1": "G1",
    "option2": "T1",
    "option3": "T2",
    "option4": "T3",
    "option5": "T4"
  };
  
  const filter = filterMap[selectedValue] || "G1";
  renderTable(filter);
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
