const signup = document.getElementById('signup');


signup.addEventListener('click',async(e)=>{
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    if(name.value && email.value && password.value){
        try{
            const signupDetails = {
                name:name.value,
                email:email.value,
                password:password.value
            }
            const getLoginPost = await axios.post('http://localhost:3000/user/login',signupDetails);
            console.log(getLoginPost);
        }catch(err){
            console.log(err)
        }
    }  
})
