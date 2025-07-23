// DOM Elements
const addItemBtn = document.getElementById('addItemBtn');
const modal = document.getElementById('modal');
const saveItemBtn = document.getElementById('saveItemBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const itemNameInput = document.getElementById('itemNameInput');
const itemQtyInput = document.getElementById('itemQtyInput');
const inventoryTable = document.getElementById('inventoryTable');
const searchInput = document.getElementById('searchInput');
const toggle = document.getElementById('toggleDarkMode');
const icon = document.querySelector('.slider .icon');
const searchToggle = document.getElementById('searchToggle');
const searchContainer = document.getElementById('searchContainer');

let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Show Modal
addItemBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  itemNameInput.value = '';
  itemQtyInput.value = '';
  itemNameInput.focus();
});

// Hide Modal
closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Save New Item
saveItemBtn.addEventListener('click', () => {
  const name = itemNameInput.value.trim();
  const qty = parseInt(itemQtyInput.value);

  if (name && !isNaN(qty)) {
    inventory.push({ name, qty });
    updateInventory();
    modal.classList.add('hidden');
  }
});

// Render Inventory Table
function renderTable(data) {
  inventoryTable.innerHTML = '';

  data.forEach((item, index) => {
    const row = document.createElement('tr');

    // Item Name
    const nameTd = document.createElement('td');
    nameTd.textContent = item.name;
    row.appendChild(nameTd);

    // Quantity
    const qtyTd = document.createElement('td');
    qtyTd.textContent = item.qty;
    row.appendChild(qtyTd);

    // Actions
    const actionTd = document.createElement('td');
    actionTd.className = 'actions';

    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.className = 'add';
    plusBtn.onclick = () => {
      item.qty++;
      updateInventory();
    };

    const minusBtn = document.createElement('button');
    minusBtn.textContent = '-';
    minusBtn.className = 'sub';
    minusBtn.onclick = () => {
      if (item.qty > 0) item.qty--;
      updateInventory();
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑';
    delBtn.className = 'delete';
    delBtn.onclick = () => {
    const confirmDelete = confirm(`Are you sure you want to delete "${item.name}"?`);
    if (confirmDelete) {
      inventory.splice(index, 1);
      updateInventory();
    }
  };


    actionTd.append(plusBtn, minusBtn, delBtn);
    row.appendChild(actionTd);

    // Alert
    const alertTd = document.createElement('td');
    if (item.qty === 0) {
      alertTd.textContent = 'Out of Stock';
      alertTd.className = 'alert-empty';
    } else if (item.qty <= 5) {
      alertTd.textContent = 'Low Stock';
      alertTd.className = 'alert-low';
    } else {
      alertTd.textContent = 'OK';
      alertTd.className = 'alert-ok';
    }
    row.appendChild(alertTd);

    inventoryTable.appendChild(row);
  });
}

// Update LocalStorage and Refresh Table
function updateInventory() {
  localStorage.setItem('inventory', JSON.stringify(inventory));
  renderTable(inventory);
}

// Search Items

// 📦 Filter inventory based on search query
function filterInventory(query) {
  return inventory.filter(item =>
    item.name.toLowerCase().includes(query)
  );
}

// 👁️ Show/Hide table rows based on filtered results
function updateTableVisibility(filtered) {
  const rows = document.querySelectorAll("#inventoryTable tbody tr");

  // Assumes inventory and rows are in same order
  rows.forEach((row, index) => {
    const item = inventory[index];
    const match = filtered.includes(item);
    row.style.display = match ? "" : "none";
  });
}

// 🛠️ Render table from scratch
function renderTable(data) {
  const tbody = document.querySelector("#inventoryTable tbody");
  tbody.innerHTML = ""; // Clear existing rows

  if (data.length === 0) {
    const noResultRow = document.createElement("tr");
    noResultRow.innerHTML = `
      <td colspan="3" style="text-align:center; color: #999;">No results found</td>
    `;
    tbody.appendChild(noResultRow);
    noResultRow.classList.add("no-results");
    return;
  }

  data.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.branch}</td>
    `;

    tbody.appendChild(row);
  });
}

// 🎯 Main search event handler
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = filterInventory(query);
  const rows = document.querySelectorAll("#inventoryTable tbody tr");

  // If table is in sync with inventory, just show/hide
  if (rows.length === inventory.length) {
    updateTableVisibility(filtered);
  } else {
    renderTable(filtered);
  }
});

// Initial Load
updateInventory();

// Export to CSV
document.getElementById('exportCsvBtn').addEventListener('click', () => {
  if (inventory.length === 0) {
    alert("Inventory is empty.");
    return;
  }

  const headers = ["Item Name", "Quantity"];
  const rows = inventory.map(item => [item.name, item.qty]);

  let csvContent = headers.join(",") + "\n";

  rows.forEach(row => {
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "laundry-inventory.csv";
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Modal trigger for footer links
const footerLinks = document.querySelectorAll('.footer-link');
const allModals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.close-modal');

footerLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const modalId = `modal-${link.dataset.modal}`;
    document.getElementById(modalId).classList.remove('hidden');
  });
});

// Close buttons
closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').classList.add('hidden');
  });
});

// Dark Mode Toggle

toggle.addEventListener('change', function () {
  document.body.classList.toggle('dark');

  // Emoji swap
  if (document.body.classList.contains('dark')) {
    icon.textContent = '☀️';
  } else {
    icon.textContent = '🌙';
  }
});

// Input 
searchToggle.addEventListener('click', () => {
  searchContainer.classList.toggle('active');

  // Auto-focus input after expanding
  if (searchContainer.classList.contains('active')) {
    setTimeout(() => searchInput.focus(), 300);
  }
});

// Optional: Close input when clicking outside
document.addEventListener('click', (e) => {
  if (!searchContainer.contains(e.target)) {
    searchContainer.classList.remove('active');
  }
});
