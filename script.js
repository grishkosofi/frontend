document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('searchInput');
  const currency = document.getElementById('currencySelect');
  if (search) {
    search.addEventListener('input', () => {
      document.querySelectorAll('.stock-link, .news-card').forEach(el => {
        const text = el.textContent.toLowerCase();
        el.style.display = text.includes(search.value.toLowerCase()) ? '' : 'none';
      });
    });
  }
  if (currency) {
    currency.addEventListener('change', () => alert(`Currency changed to ${currency.value}. Connect API conversion here.`));
  }
  const chartCanvas = document.getElementById('priceChart');
  if (chartCanvas && window.Chart) {
    new Chart(chartCanvas, {
      type: 'line',
      data: { labels: ['1','2','3','4','5','6','7'], datasets: [{ label: 'AAPL', data: [189,191,190,192,193,192,194], borderColor: '#4ea3ff', tension: .35, fill: false }] },
      options: { responsive: true, plugins: { legend: { labels: { color: '#ecf2ff' } } }, scales: { x: { ticks: { color: '#9fb0cc' }, grid: { color: 'rgba(255,255,255,.06)' } }, y: { ticks: { color: '#9fb0cc' }, grid: { color: 'rgba(255,255,255,.06)' } } } }
    });
  }
});