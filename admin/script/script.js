//Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const openSidebar = document.getElementById('openSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('overlay');

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

// Sales Chart
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
              font: {
                size: 14
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#555' },
            grid: { color: '#eee' }
          },
          y: {
            ticks: {
              color: '#555',
              callback: function(value) {
                return '₱' + value.toLocaleString();
              }
            },
            grid: { color: '#eee' }
          }
        }
      }
    });