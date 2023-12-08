const addExpence = document.getElementById('addExpence');
const showExpences = document.getElementById('showExpences');

addExpence.addEventListener('click',async(e)=>{
    e.preventDefault();
    try{
        const amount = document.getElementById('amount').value;
        const decription = document.getElementById('decription').value;
        const category = document.getElementById('category').value;

        console.log(amount , decription , category);
        const getPostExpence = await axios.post('http://localhost:3000/expence/postExpence',{amount , decription , category})
        createExpences(amount , decription , category,getPostExpence.data.id)
    }catch(err){
        console.log(err)
    }    
})

showExpences.addEventListener('click',async(e)=>{
    if(e.target.classList.contains('delete')){
        try{
            const id = e.target.parentNode.id;
            await axios.delete(`http://localhost:3000/expence/deleteExpence?id=${id}`);
            const expenceDiv = document.getElementById(`${id}`);
            showExpences.removeChild(expenceDiv);
        }catch(err){
            console.log(err)
        }
    }
})

window.addEventListener('DOMContentLoaded',async()=>{
    const getExpenceData = await axios.get('http://localhost:3000/expence/getExpences');
    getExpenceData.data.forEach(({id,amount,decription,category})=>createExpences(amount,decription,category,id))
})

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