
const addExpence = document.getElementById('addExpence');
const showExpences = document.getElementById('showExpences');
const token = localStorage.getItem('token');
const premium = document.getElementById('premiumButton')
// console.log(user)
premium.onclick = async (e)=>{
    console.log(token);
    const response = await axios.get('http://localhost:3000/purchase/premiumMembership',{headers:{'Authorization':token}});
    console.log(response);
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
    const getExpenceData = await axios.get('http://localhost:3000/expence/getExpences',{headers:{'Authorization':token}});
    getExpenceData.data.allexpences.forEach(({id,amount,decription,category})=>createExpences(amount,decription,category,id))
    if(getExpenceData.data.isPremium){
        makePremium();
    }
})
function makePremium(){
        const premium = document.getElementById('premium');
        const nav = document.getElementsByTagName('nav');
        nav[0].style.backgroundColor ='rgb(247, 125, 247)';
        addExpence.style.backgroundColor='rgb(247, 125, 247)'
        premium.style.display='none';
}

function createExpences(amount,description,category,id){
    const expenceDiv = document.createElement('div');
    const expenceAmount = document.createElement('p');
    const expenceDescrip = document.createElement('p');
    const expenceCategory = document.createElement('p');
    const del = document.createElement('button');

    expenceDiv.className = 'expences';
    expenceDiv.id = id;
    expenceAmount.innerText = `amount :${amount}  |`;
    expenceDescrip.innerText = `description :${description}  |`;
    expenceCategory.innerText = `category :${category}  `;
    del.innerHTML='&#10060'
    del.className='delete'

    expenceDiv.appendChild(expenceAmount)
    expenceDiv.appendChild(expenceDescrip)
    expenceDiv.appendChild(expenceCategory)
    expenceDiv.appendChild(del)

    showExpences.appendChild(expenceDiv)
    
}