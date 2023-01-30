const express = require('express');
const app = express();
const { Storage } = require('@google-cloud/storage');
const { format } = require('util');



const storage = new Storage({
  projectId: 'rxtra-366106',
  credentials: require('../rxtra-366106-cef4a1e07ea3.json'),
  predefinedAcl: 'publicRead',
  cacheControl: 'public, max-age=31536000',
  keyFilename: 'rxtra-366106-cef4a1e07ea3.json'
});

// const bucket = storage.bucket("gs://rxtra.appspot.com");
const bucket = storage.bucket("rxtra");


var uploadImageToStorage = async (file) => {
  console.log(file);
  if (!file) {
    return null;
  }
  console.log("blobStream " + file.name);
  var file_name = (file.name.replace(/\s/g, '').trim());
  let newFileName = `${Date.now()}_${file_name}`;
  console.log("blobStream " + newFileName.replace(/\s/g, ''));
  let fileUpload = bucket.file(newFileName);


  const blobStream = await fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
  console.log("blobStream " + url);


  /* await   blobStream.on('error', (error) => {
    return 'FAIL';
   });

 await  blobStream.on('finish', () => {
     // The public URL can be used to directly access the file via HTTP.
     
   });*/

  blobStream.end(file.data);

  return url;

}

var uploadFileToStorage = async (file) => {
  console.log(file);
  if (!file) {
    return null;
  }
  console.log("blobStream " + file.name);
  var file_name = (file.name.replace(/\s/g, '').trim());
  let newFileName = `${Date.now()}_${file_name}`;
  console.log("blobStream " + newFileName.replace(/\s/g, ''));
  let fileUpload = bucket.file(newFileName);


  const blobStream = await fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype

    }
  });

  const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
  console.log("blobStream " + url);


  /* await   blobStream.on('error', (error) => {
    return 'FAIL';
   });

 await  blobStream.on('finish', () => {
     // The public URL can be used to directly access the file via HTTP.
     
   });*/

  blobStream.end(file.data);

  return url;

}


module.exports = {
  uploadImageToStorage,
  uploadFileToStorage
}