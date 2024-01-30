
const reset = document.getElementById('reset');

reset.addEventListener('click',()=>{
    const errormsg = document.getElementById('error');
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value
    errormsg.innerText="";
    if(password && confirmPassword){
        if(password === confirmPassword){
            const url = window.location.pathname;
            const path = url.split('/');
            const id = path[path.length-1];
            console.log(id);
            axios.post('/password/setNewPassword',{password,id}).then(res=>{
            alert(res.data);
            })
            .catch((err)=>{
                console.log(err)
            });
        }else{
            errormsg.innerText="passwords didn't match";
        }
    }else{
        errormsg.innerText="please fill all fields";
    }
})