const monthTable = document.getElementById('monthTable');
const yearTable = document.getElementById('yearTable');
const reportTable = document.getElementById('reportTable');

async function createTable(){
    for(let i=0 ; i<10 ;i++){
        createMonthReport();
        createYearReport();
        createReportNote();
    }
}
createTable();

function createReportNote(){
    const noteTableRows = document.createElement('tr')
    const dateCol = document.createElement('td')
    const notesCol = document.createElement('td')

    noteTableRows.appendChild(dateCol);
    noteTableRows.appendChild(notesCol);
    
    reportTable.appendChild(noteTableRows)
}

function createYearReport(){
    const yearTableRows = document.createElement('tr')
    const monthCol = document.createElement('td')
    const incomeCol = document.createElement('td')
    const expenseCol = document.createElement('td')
    const savingCol = document.createElement('td')

    monthCol.innerText = ''
    incomeCol.innerText = ''
    expenseCol.innerText = ''
    savingCol.innerText = ''

    yearTableRows.appendChild(monthCol);
    yearTableRows.appendChild(incomeCol);
    yearTableRows.appendChild(expenseCol);
    yearTableRows.appendChild(savingCol);

    yearTable.appendChild(yearTableRows)
}

function createMonthReport(){
    const monthTableRows = document.createElement('tr')
    const dateCol = document.createElement('td')
    const descripCol = document.createElement('td')
    const categoryCol = document.createElement('td')
    const incomeCol = document.createElement('td')
    const expenseCol = document.createElement('td')

    dateCol.innerText='12-03-2023';
    descripCol.innerText='something';
    categoryCol.innerText='something';
    incomeCol.innerText='';
    expenseCol.innerText='2000';

    monthTableRows.appendChild(dateCol)
    monthTableRows.appendChild(descripCol)
    monthTableRows.appendChild(categoryCol)
    monthTableRows.appendChild(incomeCol)
    monthTableRows.appendChild(expenseCol)

    monthTable.appendChild(monthTableRows)
}