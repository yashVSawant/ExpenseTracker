const login = document.getElementById('login');
const errorMsg = document.getElementById('errorMsg');

login.addEventListener('click',async(e)=>{
    e.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    if(email.value && password.value){
        try{
            const loginDetails = {
                email:email.value,
                password:password.value
            }
            const getloginPost = await axios.post('http://localhost:3000/user/login',loginDetails);
            console.log(getloginPost.data.message);
            clearInputFields();    
            alert(`${getloginPost.data.message}`);
            window.location.href = "http://localhost:3000/expence/expencePage";
        }catch(err){
            console.log(err)
            errorMsg.innerText =`${err.message}`;
            setTimeout(()=>{
                errorMsg.innerText = '';
            },5000);
            clearInputFields();
        }
    }else{
            errorMsg.innerText ='Please Enter All Fields';
            setTimeout(()=>{
                errorMsg.innerText = '';
            },5000);
    }  
    function clearInputFields(){
        email.value ='';
        password.value ='';
    }
})
