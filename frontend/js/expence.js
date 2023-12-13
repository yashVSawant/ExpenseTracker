
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

setPages.addEventListener('click',async(e)=>{
    if(e.target.classList.contains('setButton')){
        const setLimit = parseInt(e.target.id)
        localStorage.setItem('limit',setLimit)
        setPages.innerHTML='set pages';
        showExpences.innerHTML='';
        const limit = localStorage.getItem('limit') || 10;
        const getExpenceData = await axios.get(`http://localhost:3000/expence/getExpences?page=1&limit=${limit}`,{headers:{'Authorization':token}});
        
        getExpenceData.data.allexpences.forEach(({id,amount,decription,category})=>createExpences(amount,decription,category,id))
    
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
        const getIsPremium = await axios.get('http://localhost:3000/expence/isPremiumUser',{headers:{'Authorization':token}});
        if(getIsPremium.data.isPremiumUser){
            const docDownload = await axios.get('http://localhost:3000/expence/download',{headers:{'Authorization':token}});
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

leaderboard.addEventListener('click',async()=>{
    try{
        const result = await axios.get('http://localhost:3000/premium/getLeaderboard');
        leaderboardLable.style.display='inline'
        result.data.forEach(async(item)=>{
            createLeaderboard(item.name,item.totalExpence)
        })
    }catch(err){
        alert('error')
    }
     
    
})
// console.log(user)
premium.onclick = async (e)=>{
    try{
        // console.log(token);
        const response = await axios.get('http://localhost:3000/purchase/premiumMembership',{headers:{'Authorization':token}});
        // console.log(response);
        const options ={
            'key':response.data.key_id,
            'order_id':response.data.order.id,
            'handler':async function (response){
                await axios.post('http://localhost:3000/purchase/updatePremiumMembership',{
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
            console.log(response);
            await axios.post('http://localhost:3000/purchase/updatePremiumMembership',{
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
    try{
        const amount = document.getElementById('amount').value;
        const decription = document.getElementById('decription').value;
        const category = document.getElementById('category').value;
        console.log(amount , decription , category);
        const getPostExpence = await axios.post('http://localhost:3000/expence/postExpence',{amount , decription , category},{headers:{'Authorization':token}})
        createExpences(amount , decription , category,getPostExpence.data.id)
    }catch(err){
        console.log(err)
    }    
})

showExpences.addEventListener('click',async(e)=>{
    if(e.target.classList.contains('delete')){
        try{
            const id = e.target.parentNode.id;
            await axios.delete(`http://localhost:3000/expence/deleteExpence?id=${id}`,{headers:{'Authorization':token}});
            const expenceDiv = document.getElementById(`${id}`);
            showExpences.removeChild(expenceDiv);
        }catch(err){
            console.log(err)
        }
    }
})

window.addEventListener('DOMContentLoaded',async()=>{
    const limit = localStorage.getItem('limit') || 10;
    const getIsPremium = await axios.get('http://localhost:3000/expence/isPremiumUser',{headers:{'Authorization':token}});
    if(getIsPremium.data.isPremiumUser){
        makePremium();
    }
    const getExpenceData = await axios.get(`http://localhost:3000/expence/getExpences?page=1&limit=${limit}`,{headers:{'Authorization':token}});
    for(let i =1 ;i<=getExpenceData.data.data.totalPage ;i++){
        createPageButton(i);
    }

    getExpenceData.data.allexpences.forEach(({id,amount,decription,category})=>createExpences(amount,decription,category,id))
    const getReports = await axios.get('http://localhost:3000/expence/reportUrl',{headers:{'Authorization':token}})
    getReports.data.reports.forEach((item)=>{
        showReports(item)
    })
})

pageButton.addEventListener('click',async(e)=>{

    if(e.target.classList.contains('pages')){
        const page = parseInt(e.target.id);
        const limit = localStorage.getItem('limit') || 10;
        const getExpenceData = await axios.get(`http://localhost:3000/expence/getExpences?page=${page}&limit=${limit}`,{headers:{'Authorization':token}});
        const lengths = showExpences.children.length;
        for(let i=1 ; i <=lengths ; i++){showExpences.removeChild(showExpences.children[0])};
        getExpenceData.data.allexpences.forEach(({id,amount,decription,category})=>createExpences(amount,decription,category,id))
    }
})

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
    expenceDiv.innerHTML=`<p>amount :${amount}  |</p>
    <p>description :${description}  |</p>
    <p>category :${category}</p>
    <button class='delete'>&#10060</button>
    `
    expenceDiv.className = 'expences';
    expenceDiv.id = id;
    
    showExpences.appendChild(expenceDiv)
    
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

