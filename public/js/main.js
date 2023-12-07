const submit = document.getElementById('submit');


submit.addEventListener('click',async(e)=>{
    
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    if(name.value && email.value && password.value){
        // console.log(name.value, email.value ,password.value);
        const loginInfo = {
            name:name.value,
            email:email.value,
            password:password.value
        }
        try{
            const getLoginPost = await axios.post('http://localhost:3000/user/login',{loginInfo});
            console.log(getLoginPost);
        }catch(err){
            console.log(err)
        }
    }else{
        console.log('error')
    }   
})
