/* -------------------- Utilities -------------------- */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const peso = n => '₱' + Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:2});

/* -------------------- Local Storage Keys -------------------- */
const LS_KEYS = {
  PRODUCTS: 'lh_products',
  SALES: 'lh_salesMonthly', // array of 12 numbers (₱)
  KPIS: 'lh_kpis',          // {orders,new,returning}
  ACTIVITY: 'lh_activity'   // {add,update,delete}
};

function getLS(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch{ return fallback; } }
function setLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

/* -------------------- First-run seed -------------------- */
(function seedIfEmpty(){
  if(!localStorage.getItem(LS_KEYS.PRODUCTS)) {
    const sample = [
      {code:'LED12W', name:'LED Bulb 12W', description:'Warm light, energy saving', category:'LED', stock:25, price:150},
      {code:'TUBE20', name:'LED Tube Light', description:'Daylight 20W', category:'Tube', stock:10, price:220},
      {code:'VINTG', name:'Vintage Edison Bulb', description:'Amber warm glow', category:'Vintage', stock:6, price:180},
    ];
    setLS(LS_KEYS.PRODUCTS, sample);
  }
  if(!localStorage.getItem(LS_KEYS.SALES)) setLS(LS_KEYS.SALES, Array(12).fill(0));
  if(!localStorage.getItem(LS_KEYS.KPIS)) setLS(LS_KEYS.KPIS, {orders:0, new:0, returning:0});
  if(!localStorage.getItem(LS_KEYS.ACTIVITY)) setLS(LS_KEYS.ACTIVITY, {add:0, update:0, delete:0});
})();

/* -------------------- Sidebar -------------------- */
const sidebar = $('#sidebar');
$('#burgerBtn')?.addEventListener('click', ()=>{
  sidebar.classList.toggle('hidden');
});

/* -------------------- Sales Overview Mockup Graph -------------------- */
const ctx = document.getElementById('salesChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [{
      label: 'Sales (₱)',
      data: [5000,7000,4000,8000,9000,12000,15000],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245,158,11,0.2)',
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive:true,
    plugins:{ legend:{ display:false }},
    scales:{ y:{ beginAtZero:true } }
  }
});

/* -------------------- Inventory Table -------------------- */
function buildRow(p, idx){
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="py-3 px-4">${p.code}</td>
    <td class="py-3 px-4">${p.name}</td>
    <td class="py-3 px-4">${p.description||''}</td>
    <td class="py-3 px-4">${p.category||''}</td>
    <td class="py-3 px-4">${p.stock}</td>
    <td class="py-3 px-4">${peso(p.price||0)}</td>
    <td class="py-3 px-4">
      <button class="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 mr-2" data-edit="${idx}">Edit</button>
      <button class="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700" data-del="${idx}">Delete</button>
    </td>
  `;
  return tr;
}

function loadInventory(filterText=''){
  const tbody = $('#inventoryTable');
  const products = getLS(LS_KEYS.PRODUCTS, []);
  const q = filterText.trim().toLowerCase();
  const filtered = q
    ? products.filter(p =>
        [p.code,p.name,p.category,p.description].some(v => (v||'').toLowerCase().includes(q)))
    : products;

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-gray-500">No products found</td></tr>`;
  } else {
    filtered.forEach((p, idx) => tbody.appendChild(buildRow(p, idx)));
  }
  $('#invCount').textContent = `${filtered.length} item(s)`;
  renderLowStock(products);
  renderBestSellers(products);
}

/* -------------------- Low Stock & Best Sellers -------------------- */
function renderLowStock(products){
  const list = $('#lowStockList'); list.innerHTML='';
  const low = products.filter(p=> Number(p.stock)<=10).sort((a,b)=>a.stock-b.stock).slice(0,3);
  if(low.length===0){ list.innerHTML = `<li class="text-gray-500">No low stock items 🎉</li>`; return; }
  low.forEach(p=>{
    const li = document.createElement('li');
    li.className = 'flex justify-between';
    li.innerHTML = `<span>${p.name}</span><span class="text-red-500">${p.stock} pcs</span>`;
    list.appendChild(li);
  });
}
function renderBestSellers(products){
  const list = $('#bestSellers'); list.innerHTML='';
  const items = products.sort((a,b)=>(b.price||0)-(a.price||0)).slice(0,3);
  if(items.length===0){ list.innerHTML = `<li class="text-gray-500">No items yet</li>`; return; }
  items.forEach(p=>{
    const li = document.createElement('li');
    li.className='flex justify-between';
    li.innerHTML = `<span>${p.name}</span><span class="font-bold">${peso(p.price||0)}</span>`;
    list.appendChild(li);
  });
}

/* -------------------- Add / Edit / Delete -------------------- */
$('#productForm').addEventListener('submit', e=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const prod = Object.fromEntries(fd.entries());
  prod.stock = Number(prod.stock||0);
  prod.price = Number(prod.price||0);

  if(!prod.code || !prod.name || !prod.category){
    alert('Please fill in Code, Name, and Category.');
    return;
  }

  const list = getLS(LS_KEYS.PRODUCTS, []);
  const idx = list.findIndex(x=> x.code.toLowerCase() === prod.code.toLowerCase());

  if(idx >= 0){
    list[idx] = {...list[idx], ...prod};
    alert('Product updated.');
  } else {
    list.push(prod);
    alert('Product added.');
  }
  setLS(LS_KEYS.PRODUCTS, list);
  loadInventory($('#globalSearch').value);
  e.target.reset();
});

// delegate edit/delete
$('#inventoryTable').addEventListener('click', e=>{
  const editIdx = e.target.getAttribute('data-edit');
  const delIdx = e.target.getAttribute('data-del');
  const list = getLS(LS_KEYS.PRODUCTS, []);

  if(editIdx !== null){
    const i = Number(editIdx);
    const p = list[i];
    const name = prompt('Name:', p.name); if(name===null) return;
    const category = prompt('Category:', p.category); if(category===null) return;
    const description = prompt('Description:', p.description??''); if(description===null) return;
    const stock = prompt('Stock:', p.stock); if(stock===null) return;
    const price = prompt('Price (₱):', p.price); if(price===null) return;

    list[i] = {...p, name, category, description, stock:Number(stock||0), price:Number(price||0)};
    setLS(LS_KEYS.PRODUCTS, list);
    loadInventory($('#globalSearch').value);
    alert('Product updated.');
  }

  if(delIdx !== null){
    const i = Number(delIdx);
    const ok = confirm(`Delete "${list[i].name}"?`);
    if(!ok) return;
    list.splice(i,1);
    setLS(LS_KEYS.PRODUCTS, list);
    loadInventory($('#globalSearch').value);
    alert('Product deleted.');
  }
});

/* -------------------- Search -------------------- */
$('#globalSearch').addEventListener('keydown', e=>{
  if(e.key === 'Enter'){
    loadInventory(e.target.value);
    document.querySelector('#inventorySec')?.scrollIntoView({behavior:'smooth'});
  }
});

/* -------------------- CSV Export/Import -------------------- */
$('#downloadCsv').addEventListener('click', ()=>{
  const rows = getLS(LS_KEYS.PRODUCTS, []);
  const header = ['code','name','description','category','stock','price'];
  const csv = [header.join(',')]
    .concat(rows.map(r=> header.map(h=>{
      const v = (r[h] ?? '').toString().replace(/"/g,'""');
      return /,|\n|"/.test(v) ? `"${v}"` : v;
    }).join(',')))
    .join('\n');

  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'inventory.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

$('#uploadCsv').addEventListener('change', async (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split(',').map(h=>h.trim().toLowerCase());
  const required = ['code','name','description','category','stock','price'];
  if(!required.every(h=> header.includes(h))){ alert('CSV must include: ' + required.join(', ')); return; }

  const idx = Object.fromEntries(header.map((h,i)=>[h,i]));
  const rows = lines.map(line=>{
    const cols = line.split(',');
    return {
      code: cols[idx.code]||'',
      name: cols[idx.name]||'',
      description: cols[idx.description]||'',
      category: cols[idx.category]||'',
      stock: Number(cols[idx.stock]||0),
      price: Number(cols[idx.price]||0)
    };
  });

  setLS(LS_KEYS.PRODUCTS, rows);
  loadInventory($('#globalSearch').value);
  alert('CSV imported successfully.');
  e.target.value = '';
});

/* -------------------- Admin Dropdown -------------------- */
$('#adminMenuButton')?.addEventListener('click', ()=>{
  $('#adminDropdown').classList.toggle('hidden');
});

/* -------------------- Init -------------------- */
loadInventory();
