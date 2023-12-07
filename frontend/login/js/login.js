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
           if(getloginPost.data){
            const getPasswordInfo = await axios.post('http://localhost:3000/user/checkPassword',loginDetails);
            if(getPasswordInfo.data){
                console.log('valid user')
            }else{
                errorMsg.innerText =`incorrect password`;
            }
           }else{
                errorMsg.innerText =`user not found`;
           }
            email.value ='';
            password.value ='';
                setTimeout(()=>{
                    errorMsg.innerText = '';
                },2000);
        }catch(err){
            console.log(err)
        }
    }  
})
