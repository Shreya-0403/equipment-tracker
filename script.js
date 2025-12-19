const API = "http://127.0.0.1:8000/api/equipment";

const form = document.getElementById("equipmentForm");
const table = document.getElementById("equipmentTable");
const formTitle = document.getElementById("formTitle");

const idField = document.getElementById("equipmentId");
const nameField = document.getElementById("name");
const typeField = document.getElementById("type");
const statusField = document.getElementById("status");
const dateField = document.getElementById("date");

/* ---------- VIEW ---------- */
function loadEquipment() {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      table.innerHTML = "";

      if (data.length === 0) {
        table.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center;color:#666;">
              No equipment added yet
            </td>
          </tr>`;
        return;
      }

      data.forEach(e => {
        table.innerHTML += `
          <tr>
            <td>${e.name}</td>
            <td>${e.type}</td>
            <td>
  <span class="status ${e.status.replace(" ", "")}">
    ${e.status}
  </span>
</td>
            <td>${e.last_cleaned}</td>
            <td>
              <button class="action-btn edit-btn"
                onclick="editEquipment(${e.id}, '${e.name}', '${e.type}', '${e.status}', '${e.last_cleaned}')">
                Edit
              </button>
              <button class="action-btn delete-btn"
                onclick="deleteEquipment(${e.id})">
                Delete
              </button>
            </td>
          </tr>`;
      });
    });
}

/* ---------- ADD / UPDATE ---------- */
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const payload = {
    name: nameField.value,
    type: typeField.value,
    status: statusField.value,
    last_cleaned: dateField.value
  };

  if (idField.value === "") {
    // ADD
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => loadEquipment());
  } else {
    // UPDATE
    fetch(`${API}/${idField.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => loadEquipment());
  }

  resetForm();
});

/* ---------- EDIT ---------- */
function editEquipment(id, name, type, status, date) {
  idField.value = id;
  nameField.value = name;
  typeField.value = type;
  statusField.value = status;
  dateField.value = date;

  formTitle.textContent = "Edit Equipment";
}

/* ---------- DELETE ---------- */
function deleteEquipment(id) {
  if (confirm("Are you sure you want to delete this equipment?")) {
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then(() => loadEquipment());
  }
}

/* ---------- RESET ---------- */
function resetForm() {
  form.reset();
  idField.value = "";
  formTitle.textContent = "Add Equipment";
}

loadEquipment();
