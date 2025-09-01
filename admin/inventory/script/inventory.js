// Load items from localStorage
    function loadInventory() {
      const products = JSON.parse(localStorage.getItem("products")) || [];
      const table = document.getElementById("inventoryTable");
      table.innerHTML = "";

      if (products.length === 0) {
        table.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">No products found</td></tr>`;
        return;
      }

      products.forEach((p, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="py-3 px-4">${p.code}</td>
          <td class="py-3 px-4">${p.name}</td>
          <td class="py-3 px-4">${p.description}</td>
          <td class="py-3 px-4">${p.category}</td>
          <td class="py-3 px-4">${p.stock}</td>
          <td class="py-3 px-4 space-x-2">
            <button onclick="editItem(${index})" class="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
            <button onclick="deleteItem(${index})" class="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
          </td>
        `;
        table.appendChild(row);
      });
    }

    // Delete item
    function deleteItem(index) {
      let products = JSON.parse(localStorage.getItem("products")) || [];
      products.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(products));
      loadInventory();
    }

    // Edit item
    function editItem(index) {
      let products = JSON.parse(localStorage.getItem("products")) || [];
      const item = products[index];

      const newName = prompt("Enter new name:", item.name);
      const newDesc = prompt("Enter new description:", item.description);
      const newCat = prompt("Enter new category:", item.category);
      const newStock = prompt("Enter new stock:", item.stock);

      if (newName && newStock && newCat) {
        products[index] = { ...item, name: newName, description: newDesc, category: newCat, stock: newStock };
        localStorage.setItem("products", JSON.stringify(products));
        loadInventory();
      }
    }

    loadInventory();