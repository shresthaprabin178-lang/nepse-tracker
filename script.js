let stocks = JSON.parse(localStorage.getItem('stocks')) || [];

function saveStocks() {
    localStorage.setItem('stocks', JSON.stringify(stocks));
}

function addStock() {
    let name = document.getElementById("stockName").value.toUpperCase();
    const quantity = parseFloat(document.getElementById("quantity").value);
    const target = parseFloat(document.getElementById("targetPrice").value);
    const ltp = parseFloat(document.getElementById("ltp").value);
    const wacc = parseFloat(document.getElementById("wacc").value);

    if(name && quantity > 0 && target > 0 && ltp >= 0 && wacc > 0) {
        stocks.push({name, quantity, target, ltp, wacc});
        document.getElementById("stockName").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("targetPrice").value = "";
        document.getElementById("ltp").value = "";
        document.getElementById("wacc").value = "";

        saveStocks();
        displayStocks();
    } else {
        alert("Please enter valid details");
    }
}

function displayStocks() {
    const stockList = document.getElementById("stockList");
    stockList.innerHTML = "";

    let currentValue = 0;
    let totalPL = 0;
    let currentInvestment = 0;
    let totalProfitLoss = 0;

    stocks.forEach((stock, index) => {
        const amount = stock.ltp * stock.quantity;
        const profitLoss = (stock.ltp - stock.wacc) * stock.quantity;
        const plPercent = ((stock.ltp - stock.wacc)/stock.wacc) * 100;
        const investment = stock.wacc * stock.quantity;

        currentValue += amount;
        totalPL += profitLoss;
        currentInvestment += investment;
        totalProfitLoss += profitLoss;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${stock.name}</td>
            <td contenteditable="true" oninput="updateStock(${index}, 'quantity', this.textContent)">${stock.quantity}</td>
            <td>${stock.target}</td>
            <td contenteditable="true" oninput="updateStock(${index}, 'wacc', this.textContent)">${stock.wacc}</td>
            <td contenteditable="true" oninput="updateStock(${index}, 'ltp', this.textContent)">${stock.ltp}</td>
            <td>${amount.toFixed(2)}</td>
            <td class="${profitLoss >=0 ? 'profit' : 'loss'}">${profitLoss.toFixed(2)}</td>
            <td class="${profitLoss >=0 ? 'profit' : 'loss'}">${plPercent.toFixed(2)}%</td>
            <td><button class="delete-btn" onclick="deleteStock(${index})">Delete</button></td>
        `;

        stockList.appendChild(row);
    });

    document.getElementById("currentValue").textContent = currentValue.toFixed(2);
    document.getElementById("totalPL").textContent = totalPL.toFixed(2);
    document.getElementById("currentInvestment").textContent = currentInvestment.toFixed(2);
    document.getElementById("totalProfitLoss").textContent = totalProfitLoss.toFixed(2);

    saveStocks();
}

function updateStock(index, field, value) {
    let val = parseFloat(value);
    if(isNaN(val) || val < 0) return;
    stocks[index][field] = val;
    displayStocks();
}

function deleteStock(index) {
    stocks.splice(index, 1);
    displayStocks();
}

function sortStocks(field) {
    if(field === 'name') {
        stocks.sort((a,b) => a.name.localeCompare(b.name));
    } else if(field === 'profitLoss') {
        stocks.sort((a,b) => (b.ltp - b.wacc)*b.quantity - (a.ltp - a.wacc)*a.quantity);
    }
    displayStocks();
}

// Simulate live LTP updates every 5 seconds
function fetchLiveLTP() {
    // Example simulated live data
    const liveLTP = {
        'APEX': 250,
        'NIBL': 320,
        'ADBL': 300
        // Add your stocks here
    };

    stocks.forEach(stock => {
        if(liveLTP[stock.name]) stock.ltp = liveLTP[stock.name];
    });

    displayStocks();
}

setInterval(fetchLiveLTP, 5000);

// Load data on page load
displayStocks();
