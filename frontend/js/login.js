const login = document.getElementById('login');
const errorMsg = document.getElementById('errorMsg');
const forgotPassword = document.getElementById('forgotPassword');

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
            const getloginPost = await axios.post('http://23.20.207.198:3000/user/login',loginDetails);
            const token = getloginPost.data.token;
            console.log(token);
            clearInputFields();    
            alert(`${getloginPost.data.message}`);
            localStorage.setItem('token',token);
            window.location.href = '../html/expence.html';
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

forgotPassword.addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.href = '../html/forgotPassword.html';
})