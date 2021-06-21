const fs = require('fs');
const fileFolder = './data';
fs.readdir(fileFolder,(err,fileList)=>{
    console.log(fileList);
})