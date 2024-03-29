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
                password:password.value,
                isPremium:false
            }
            await axios.post('/user/signup',signupDetails);
            alert('User signup successfully');
            window.location.href = '../login/index.html';
        }catch(err){
            console.log(err)
            errorMsg.innerText =`${err.response.data}`
                // console.log(getSignupPost.data.fields)
                setTimeout(()=>{
                    errorMsg.innerText = '';
                },5000);
                clearInputFields();
        }
    }else{
        errorMsg.innerText ='Please Enter All Fields'
        setTimeout(()=>{
            errorMsg.innerText = '';
        },5000); 
    }
    function clearInputFields(){
        name.value ='';
        email.value ='';
        password.value ='';
    }  
})
