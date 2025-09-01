// Sidebar Toggle
const sidebar = document.getElementById('sidebar');
const openSidebar = document.getElementById('openSidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('overlay');

if (sidebar && openSidebar && closeSidebar && overlay) {
  function showSidebar() {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  }

  function hideSidebar() {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }

  openSidebar.addEventListener('click', showSidebar);
  closeSidebar.addEventListener('click', hideSidebar);
  overlay.addEventListener('click', hideSidebar);
}

// Sales Chart (only on admin.html)
if (document.getElementById('salesChart')) {
  const ctx = document.getElementById('salesChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Aug 1', 'Aug 5', 'Aug 10', 'Aug 15', 'Aug 20', 'Aug 25', 'Aug 30'],
      datasets: [{
        label: 'Sales (₱)',
        data: [15000, 23000, 18000, 26000, 22000, 28000, 30000],
        backgroundColor: 'rgba(59,130,246,0.15)',
        borderColor: '#3b82f6',
        borderWidth: 3,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3b82f6',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#3b82f6',
            font: { size: 14 }
          }
        }
      },
      scales: {
        x: { ticks: { color: '#555' }, grid: { color: '#eee' } },
        y: {
          ticks: {
            color: '#555',
            callback: value => '₱' + value.toLocaleString()
          },
          grid: { color: '#eee' }
        }
      }
    }
  });
}

// Save product (only on product.html)
const saveBtn = document.getElementById("saveProductBtn");
if (saveBtn) {
  saveBtn.addEventListener("click", function () {
    // Get form values
    const code = document.querySelector("input[name='code']").value;
    const name = document.querySelector("input[name='name']").value;
    const description = document.querySelector("textarea[name='description']").value;
    const category = document.querySelector("select[name='category']").value;
    const stock = document.querySelector("input[name='stock']").value;

    if (!code || !name || !category || !stock) {
      alert("Please fill in all required fields!");
      return;
    }

    // Create product object
    const product = { code, name, description, category, stock };

    // Save to localStorage
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));

    // Redirect to inventory page
    window.location.href = "../inventory/inventory.html";
  });
}

// Load inventory (only on inventory.html)
const tableBody = document.getElementById("inventoryTable");
if (tableBody) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  if (products.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">No products found</td></tr>`;
  } else {
    products.forEach(p => {
      const row = `
        <tr>
          <td class="py-3 px-4">${p.code}</td>
          <td class="py-3 px-4">${p.name}</td>
          <td class="py-3 px-4">${p.description}</td>
          <td class="py-3 px-4">${p.category}</td>
          <td class="py-3 px-4">${p.stock}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  }
}
