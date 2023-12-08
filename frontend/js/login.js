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
            const getPasswordInfo = await axios.post('http://localhost:3000/user/checkPassword',loginDetails);
            console.log('login successfully');
            alert('User login successfully'); 
            clearInputFields();     
        }catch(err){
            // console.log(err)
            errorMsg.innerText =`${err.response.data}`;
            setTimeout(()=>{
                errorMsg.innerText = '';
            },5000);
            clearInputFields();
        }
    }  
    function clearInputFields(){
        email.value ='';
        password.value ='';
    }
})
