const enter = document.getElementById('enter')

enter.addEventListener('click',async(e)=>{
    e.preventDefault();
    try{
        const callForgotPassword = await axios.get('http://localhost:3000/password/forgotPassword')
        console.log(callForgotPassword)
    }catch(err){
        console.log(err)
    }
})