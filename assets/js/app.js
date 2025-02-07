
const showTable = (number) => {
  const tableOutput = document.getElementById('tableOutput');
  tableOutput.innerHTML = ''; // Clear previous table

  if (isNaN(number) || number <= 0) {
      const errorParagraph = document.createElement('p');
      errorParagraph.textContent = 'Please enter a number !';
      errorParagraph.className = 'red';
      errorParagraph.style.marginLeft ='-20px';
      errorParagraph.style.width='200px'
      errorParagraph.style.color='red'
      tableOutput.appendChild(errorParagraph);
      return;
  }

  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.marginTop = '10px';
  table.style.width = '100%';

  for (let i = 1; i <= 10; i++) {
      const row = document.createElement('tr');

      const cell = document.createElement('td');
      cell.textContent = `${number} x ${i} = ${number * i}`;
      cell.style.border = '1px solid #000';
      cell.style.padding = '8px';
      cell.style.textAlign = 'center';
      cell.style.fontFamily = 'Tahoma';
      cell.style.fontSize = '20px';
      cell.style.color='white'

      row.appendChild(cell);
      table.appendChild(row);
  }

  tableOutput.appendChild(table);
};

document.getElementById('generateTable').addEventListener('click', () => {
  const userInput = parseInt(document.getElementById('numberInput').value, 10);
  showTable(userInput);
});
