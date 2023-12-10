const brevo = require('@getbrevo/brevo');
const Sib = require('sib-api-v3-sdk');
let client = Sib.ApiClient.instance;
require('dotenv').config();

exports.forgotPassword =async (req,res,next)=>{
    const userMail = req.body.email;
    // console.log(userMail);
    let apiKey = client.authentications['api-key'];
    apiKey.apiKey = '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';
    const tranEmailApi = new Sib.TransactionalEmailsApi();
//    console.log('1')
    const sender = {
        email:'yashsawant310@gmail.com'
    }
    // console.log('2')
    const receivers =[
        {email:userMail},
    ]
    try{
        // console.log('3')
        await tranEmailApi.sendTransacEmail({
            sender,
            to:receivers,
            subject:'hi bhava',
            textContent:`
            serious msg`
            
        })
        res.send('forgotPassword')
    }catch(err){
        console.log('error from forgot password>>>')
    }
}