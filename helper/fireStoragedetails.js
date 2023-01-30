const express = require('express');
const app = express();
const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
// const { image } = require('pdfkit');

const storage = new Storage({
    projectId: 'messagingapp-3b949',
    credentials: require('../messagingapp-3b949-firebase-adminsdk-7qx1d-26d021c196.json'),
    predefinedAcl: 'publicRead',
    cacheControl: 'public, max-age=31536000'
});

const bucket = storage.bucket("gs://messagingapp-3b949.appspot.com");
  
var uploadImageToStorage = async (folder,file) => {
  if (!file) {
    return null;
  }
  var file_name = (file.name.replace(/\s/g, '').trim());
  let newFileName = `${Date.now()}_${file_name}`;
  // let fileUpload = bucket.file(folder/newFileName);
  let fileUpload = bucket.file(`${folder}/${newFileName}`);
  const blobStream = await fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });
  const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
  blobStream.end(file.data);
  return url;
}

var uploadFileToStorage = async (file) => {
  if (!file) {
    return null;
  }
  var file_name = (file.name.replace(/\s/g, '').trim());
  let newFileName = `${Date.now()}_${file_name}`;
  let fileUpload = bucket.file(newFileName);

  const blobStream = await fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
  blobStream.end(file.data);
  return url;
}

// var uploadFileToStorage = async (filename, data) => {
//   if (!filename) {
//     return null;
//   }
//   //var file_name = (file.name.replace(/\s/g, '').trim());
//   let newFileName = `${Date.now()}_${filename}`;
//   console.log("blobStream " + newFileName.replace(/\s/g, ''));
//   let fileUpload = bucket.file(newFileName);
//   console.log(fileUpload,"file ulload");
//   const blobStream = await fileUpload.createWriteStream({
//     metadata: {
//       contentType: data.mimetype
//     }
//   });
//   console.log(blobStream,"blobStream data")
//   const url = format(`https://storage.googleapis.com/${bucket.name}/${newFileName}`);
//   console.log("blobStream " + url);
//   blobStream.end(data);
//   return url;
// }

var deleteImageToStorage = async (file) => { 
  var image_file=file;
  console.log(image_file,"image_file")
  var imageurl = image_file.split("/");
  imageurl = imageurl[7].split("%2F");
  imageurl = imageurl[1].split("?alt")
//   console.log("imageurl",imageurl[0]);
//   if(imageurl.length > 4){
//     imageurl = imageurl.slice(4, imageurl.length + 1).join("/");
    console.log(imageurl,"imageurl");
    var findAndRep = imageurl[0].replace("%20", " ");
    const exists = await bucket.file(`files/${findAndRep}`).exists();
    console.log(exists,"ecits")
    if(exists == 'false'){
      console.log(file);
      
      return 'File Not Exits'
    }
    await bucket
        .file(imageurl)
        .delete()
        .then((image) => {
          console.log("success")
          return 'success'
        })
        .catch((e) => {
          console.log("failed")
          return 'failed'
        });
//   }
//   else{
//     return 'File Not Exits'
//   }
}

module.exports = {
  uploadImageToStorage,
  uploadFileToStorage,
  deleteImageToStorage
}