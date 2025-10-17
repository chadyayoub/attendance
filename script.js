// ===== Names List =====
const names = [
  'AA', 'Carbz', 'Celine AC', 'Chady', 'Christelle', 'Christy', 'Cinderella', 'Clara', 'Claude',
  'EG', 'Elias S', 'Elie Keyrouz', 'Elie Khoury', 'Georgina', 'Helena', 'Jean', 'John', 'Karen',
  'Laeticia', 'Lara', 'Lynn R', 'Maria D', 'Mariam', 'Marie Josée', 'Mario', 'Markella',
  'Marylin', 'May', 'Raphael', 'Rebeka', 'Reine', 'Tonia', 'Yara'
];

const tableBody = document.querySelector("#attendance-table tbody");

names.forEach((name) => {
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
