const enter = document.getElementById('enter');

enter.addEventListener('click',async(e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.innerText='';
    if(email){
        try{ 
            const callForgotPassword = await axios.post('/password/forgotPassword',{email})
            alert(`${callForgotPassword.data}`);
            window.location.href='../login/index.html'
        }catch(err){
            console.log(err)
        }
    }else{
        
        errorMsg.innerText = 'please enter email !'
    }
    
})