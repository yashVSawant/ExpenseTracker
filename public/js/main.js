const signup = document.getElementById('signup');
const errorMsg = document.getElementById('errorMsg');

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
            const getSignupPost = await axios.post('http://localhost:3000/user/login',signupDetails);
            console.log(getSignupPost.data);
            name.value ='';
            email.value ='';
            password.value ='';
            if(getSignupPost.data.errors){
                errorMsg.innerText =`Error:403 request failed ;email ${getSignupPost.data.fields.email} already exist`
                // console.log(getSignupPost.data.fields)
                setTimeout(()=>{
                    errorMsg.innerText = '';
                },2000);
            }else{
                console.log('posted')
            }
        }catch(err){
            console.log(err)
        }
    }  
})
