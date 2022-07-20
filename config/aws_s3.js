const fs = require('fs');
const AWS = require('aws-sdk');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION
});

const uploadProfileImage = async (toUploadFile, userId) =>{
    const fileContent = fs.readFileSync(toUploadFile);
    const extName = path.extname(toUploadFile);

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        // 저장하고 싶은 File Name
        Key: `profile_image/${userId}${extName}`,
        ContentType: "image/png",
        Body: fileContent
    };

    const res = await s3.upload(params).promise()
        .then((data)=>{
            console.log(`File uploaded successfully. ${data.Location}`);
            return data.Location;
        }); // Then
    console.log(res);
    return res;
};


const downloadFile = (fileName) =>{
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        // 저장하고 싶은 File Name
        Key: 'test.jpg',
        ContentType: "image/png",
        Body: fileContent
    };
    s3.getObject(params, function(err, data){
        if(err){
            throw err;
        }else{
            fs.writeFileSync(fileName, data.Body.toString());
        }
    });
};
module.exports = {uploadProfileImage};