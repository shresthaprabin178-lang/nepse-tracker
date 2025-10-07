const addBtn = document.getElementById('addBtn');
const table = document.getElementById('stockTable');

addBtn.addEventListener('click', () => {
  const name = document.getElementById('stockName').value.trim();
  const current = parseFloat(document.getElementById('currentPrice').value);
  const target = parseFloat(document.getElementById('targetPrice').value);

  if (!name || isNaN(current) || isNaN(target)) {
    alert("Please fill all fields correctly.");
    return;
  }

  const row = document.createElement('tr');
  const status = current >= target ? "🎯 Target Reached" : "⏳ Below Target";

  row.innerHTML = `
    <td>${name}</td>
    <td>${current.toFixed(2)}</td>
    <td>${target.toFixed(2)}</td>
    <td>${status}</td>
    <td><button class="deleteBtn">❌</button></td>
  `;

  table.appendChild(row);

  // Clear inputs
  document.getElementById('stockName').value = '';
  document.getElementById('currentPrice').value = '';
  document.getElementById('targetPrice').value = '';

  // Delete functionality
  row.querySelector('.deleteBtn').addEventListener('click', () => {
    row.remove();
  });
});
