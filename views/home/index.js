const addExpence = document.getElementById('addExpence');
const showExpences = document.getElementById('showExpences');
const token = localStorage.getItem('token');
const premium = document.getElementById('premiumButton')
const leaderboard = document.getElementById('leaderboard');
const showLeaderboard = document.getElementById('showLeaderboard');
const leaderboardLable = document.getElementById('leaderboardLable');
const report = document.getElementById('report');
const downloads = document.getElementById('download');
const showReportsHistory = document.getElementById('showReportsHistory');
const pageButton = document.getElementById('pageButton');
const setPages = document.getElementById('setPages');
const cancelUpdate = document.getElementById('cancelUpdate');
const updateExpence = document.getElementById('updateExpence');

cancelUpdate.addEventListener('click',(e)=>{
    e.preventDefault()
    backFromUpdate();
})

setPages.addEventListener('click',async(e)=>{
    if(e.target.classList.contains('setButton')){
        const setLimit = parseInt(e.target.id)
        localStorage.setItem('limit',setLimit)
        setPages.innerHTML='Set limit';
        showExpences.innerHTML='';
        const limit = localStorage.getItem('limit') || 10;
        const getExpenceData = await axios.get(`/expence/getExpences?page=1&limit=${limit}`,{headers:{'Authorization':token}});
        getExpenceData.data.allexpences.forEach(({id,amount,description,category})=>createExpences(amount,description,category,id));
        // console.log(getExpenceData.data.allexpences)
        pageButton.innerHTML=""
        for(let i =1 ;i<=getExpenceData.data.data.totalPage ;i++){
                createPageButton(i);
        }
    
    }else{
        setPages.innerHTML=`
        <div>
        <button class='setButton' id='5set'>5</button>
        <button class='setButton' id='8set'>8</button>
        <button class='setButton' id='10set'>10</button>
        <button class='setButton' id='15set'>15</button>
        <button class='setButton' id='20set'>20</button>
        </div>`
    }
})

downloads.addEventListener('click',async()=>{
    try{
        const getIsPremium = await axios.get('/expence/isPremiumUser',{headers:{'Authorization':token}});
        if(getIsPremium.data.isPremiumUser){
            const docDownload = await axios.get('/expence/download',{headers:{'Authorization':token}});
            if(docDownload.status === 200){
                const a = document.createElement('a');
                a.href=docDownload.data.fileUrl;
                a.download = 'expense.csv';
                a.click();
            }else{
                console.log('errr')
            }
        }else{
            alert('you are not a premium user')
        }
    }catch(err){
        alert('error')
    }
    
})

leaderboard.addEventListener('click',async(e)=>{
    if(e.target.classList.contains('showLeaderBoard')){
        try{
            const result = await axios.get('/premium/getLeaderboard');
            leaderboardLable.style.display='inline'
            result.data.forEach(async(item)=>{
                createLeaderboard(item.name,item.totalExpense)
            })
            e.target.className = "hindLeaderBoard";
            e.target.innerText = 'hide leaderboard';
        }catch(err){
            alert('error')
        }
    }else if(e.target.classList.contains('hindLeaderBoard')){
        showLeaderboard.innerHTML=""
        e.target.className="showLeaderBoard"
        e.target.innerText = 'Leaderboard'
    }
     
    
})
// console.log(user)
premium.onclick = async (e)=>{
    try{
        // console.log(token);
        const response = await axios.get('/purchase/premiumMembership',{headers:{'Authorization':token}});
        console.log(response);
        const options ={
            'key':response.data.key_id,
            'order_id':response.data.order.id,
            'handler':async function (response){
                await axios.post('/purchase/updatePremiumMembership',{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id,
                    status:'SUCCESS',
                    isPremium:true
                },{headers:{'Authorization':token}})

                alert('you are a premium user now')
                makePremium();
            }
        }
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed',async function (response){
            // console.log(response);
            await axios.post('/purchase/updatePremiumMembership',{
                order_id:options.order_id,
                payment_id:'null',
                status:'FAILD',
                isPremium:false
                },{headers:{'Authorization':token}})
            alert('transaction failed')
        })
    }catch(err){
        alert('error')
    }
    
}



addExpence.addEventListener('click',async(e)=>{
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('decription').value;
    const category = document.getElementById('category').value;
    if(amount && description && category){
        try{
            const getPostExpence = await axios.post('/expence/postExpence',{amount , description , category},{headers:{'Authorization':token}})
            appendNewExpences(amount , description , category,getPostExpence.data._id)
            document.getElementById('amount').value="";
            document.getElementById('decription').value="";
            document.getElementById('category').value="";
            const totalDay = document.getElementById('totalDay').innerText;
            const totalMonth = document.getElementById('totalMonth').innerText;
            const totalYear = document.getElementById('totalYear').innerText;
            displayDayExpense(+totalDay + +amount);
            displayMonthExpense(+totalMonth + +amount);
            displayYearExpense(+totalYear + +amount);
        }catch(err){
            console.log(err)
            alert("something went wrong!")
        }   
    }else{
        alert("please enter all fields")
    }
     
})
updateExpence.addEventListener('click',async(e)=>{
    e.preventDefault();
    const id= localStorage.getItem("editId")
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('decription').value;
    const category = document.getElementById('category').value;
    if(amount && description && category){
        try{
            await axios.put(`/expence/updateExpence?id=${id}`,{amount , description , category},{headers:{'Authorization':token}})
            const expenceDiv = document.getElementById(`${id}`);
            expenceDiv.innerHTML =`<p>amount :<p id="${id}amount">${amount}</p> |</p>
            <p>description :<p id="${id}description">${description}</p> |</p>
            <p>category :<p id="${id}category">${category}</p>  |</p>
            <button class='edit'>Edit</button>
            <button class='delete'>&#10060</button>
            `
            backFromUpdate();
        }catch(err){
            console.log(err)
        }   
    }else{
        alert("please enter all fields")
    }
})

showExpences.addEventListener('click',async(e)=>{
    if(e.target.classList.contains('delete')){
        try{
            const id = e.target.parentNode.id;
            const amount = document.getElementById(`${id}amount`).innerText;
            await axios.delete(`/expence/deleteExpence?id=${id}`,{headers:{'Authorization':token}});
            const expenceDiv = document.getElementById(`${id}`);
            showExpences.removeChild(expenceDiv);
            const totalDay = document.getElementById('totalDay').innerText;
            const totalMonth = document.getElementById('totalMonth').innerText;
            const totalYear = document.getElementById('totalYear').innerText;
            console.log(+totalDay - +amount)
            displayDayExpense(+totalDay - +amount);
            displayMonthExpense(+totalMonth - +amount);
            displayYearExpense(+totalYear - +amount);
        }catch(err){
            console.log(err)
        }
    }else if(e.target.classList.contains('edit')){
        try{
            const id = e.target.parentNode.id;
            localStorage.setItem("editId",id);
            const amount = document.getElementById(`${id}amount`).innerText;
            document.getElementById('amount').value = amount;
            localStorage.setItem("editAmount",amount)
            document.getElementById('decription').value=document.getElementById(`${id}description`).innerText;
            document.getElementById('category').value=document.getElementById(`${id}category`).innerText;
            document.getElementById('addButtonDiv').style.display='none';
            document.getElementById('editButtonDiv').style.display='inline';

        }catch(err){
            console.log(err)
        }
    }
})

window.addEventListener('DOMContentLoaded',async()=>{
    try{
        const totalData = await axios.get('/expence/total',{headers:{'Authorization':token}});
        displayYearExpense(totalData.data.totalYear)
        displayMonthExpense(totalData.data.totalMonth)
        displayDayExpense(totalData.data.totalDay)
        const limit = localStorage.getItem('limit') || 10;
        const getIsPremium = await axios.get('/expence/isPremiumUser',{headers:{'Authorization':token}});
        if(getIsPremium.data.isPremiumUser){
            makePremium();
        }
        const getExpenceData = await axios.get(`/expence/getExpences?page=1&limit=${limit}`,{headers:{'Authorization':token}});
        for(let i =1 ;i<=getExpenceData.data.data.totalPage ;i++){
            createPageButton(i);
        }

        getExpenceData.data.allexpences.forEach(({_id,amount,description,category})=>createExpences(amount,description,category,_id))
        const getReports = await axios.get('/expence/reportUrl',{headers:{'Authorization':token}})
        getReports.data.reports.forEach((item)=>{
            showReports(item)
        })
    }catch(err){
        console.log(err)
    }
    
})

pageButton.addEventListener('click',async(e)=>{

    if(e.target.classList.contains('pages')){
        const page = parseInt(e.target.id);
        const limit = localStorage.getItem('limit') || 10;
        const getExpenceData = await axios.get(`/expence/getExpences?page=${page}&limit=${limit}`,{headers:{'Authorization':token}});
        showExpences.innerHTML = ""
        getExpenceData.data.allexpences.forEach(({id,amount,description,category})=>createExpences(amount,description,category,id))
    }
})

function displayYearExpense(total){
    const totalYear = document.getElementById('totalYear');
    totalYear.innerText = `${total}`;
}

function displayMonthExpense(total){
    const totalMonth = document.getElementById('totalMonth');
    totalMonth.innerText =`${total}`
}

function displayDayExpense(total){
    const totalDay = document.getElementById('totalDay');
    totalDay.innerText =`${total}`
}

function showReports(data){
    const a = document.createElement('a');
    a.href = data.url;
    a.innerText=data.createdAt;
    showReportsHistory.appendChild(a)
    
}

function makePremium(){
        const premium = document.getElementById('premium');
        const leaderboard = document.getElementById('leaderboard')
        const nav = document.getElementsByTagName('nav');
        nav[0].style.backgroundColor ='rgb(247, 125, 247)';
        addExpence.style.backgroundColor='rgb(247, 125, 247)'
        premium.style.display='none';
        leaderboard.style.display='inline';
}

function createExpences(amount,description,category,id){
    const expenceDiv = document.createElement('div');
    expenceDiv.innerHTML=`<p>amount :<p id="${id}amount">${amount}</p> |</p>
    <p>description :<p id="${id}description">${description}</p> |</p>
    <p>category :<p id="${id}category">${category}</p>  |</p>
    <button class='edit'>Edit</button>
    <button class='delete'>&#10060</button>
    `
    expenceDiv.className = 'expences';
    expenceDiv.id = id;

    showExpences.appendChild(expenceDiv); 
}
function appendNewExpences(amount,description,category,id){
    const expenceDiv = document.createElement('div');
    expenceDiv.innerHTML=`<p>amount :<p id="${id}amount">${amount}</p> |</p>
    <p>description :<p id="${id}description">${description}</p> |</p>
    <p>category :<p id="${id}category">${category}</p>  |</p>
    <button class='edit'>Edit</button>
    <button class='delete'>&#10060</button>
    `
    expenceDiv.className = 'expences';
    expenceDiv.id = id;
    showExpences.insertBefore(expenceDiv,showExpences.childNodes[0]); 
}

function createLeaderboard(name,amount){
    const expenceDiv = document.createElement('div');
    expenceDiv.className='premiumLeaderboard';
    expenceDiv.innerHTML =`
    <p>name :${name} -</p>
    <p>total amount:${amount}</p>
    `
    showLeaderboard.appendChild(expenceDiv)
}

function createPageButton(page){
    const button = document.createElement('button');
    button.innerText=page;
    button.id = `${page}page`
    button.className = 'pages'
    pageButton.appendChild(button);
}

function backFromUpdate(){
    document.getElementById('addButtonDiv').style.display="inline";
    document.getElementById('editButtonDiv').style.display="none";
    document.getElementById('amount').value="";
    document.getElementById('decription').value="";
    document.getElementById('category').value="";
}

