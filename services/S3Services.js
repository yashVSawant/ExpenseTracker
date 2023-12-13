const AWS = require('aws-sdk');
const uploadToS3 = (data , filename)=>{
    const BUCKET_NAME = 'expencetracker310';
    const IAM_USER_KEY = 'AKIAVOLWZS3FGDC5YOEW';
    const IAM_USER_SECRET = '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';

    let s3bucket = new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    })

    
        var param ={
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'
        }

        return new Promise((resolve,reject)=>{
            s3bucket.upload(param ,(err,s3response)=>{
                if(err){
                    console.log("somthing went wrong ",err)
                    reject(err)
                }else{
                    console.log('success');
                    resolve(s3response.Location);
                }
            })
        })
        

}
module.exports ={uploadToS3};