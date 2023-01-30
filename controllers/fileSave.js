const fireBase = require('../helper/firebaseHelper');
const ffmpeg=  require('fluent-ffmpeg')

module.exports.saveFile = async (req, res, next) => {
  try {
    // var fileName = req.files.file.name;
    console.log("req.files",req.files.name);
    var url
    if (req.files != undefined) {
        var url = await fireBase.uploadImageToStorage(req.files.name);
        console.log("url",url);
      }

    return res.json(url);
  } catch (ex) {
    next(ex);
  }
};
module.exports.compressFile = async (req, res, next) => {
  try {
    console.log("req.files",req.files.video.name);
    console.log("ffmpeg",ffmpeg);
    ffmpeg(req.files.video.name)
    .withOutputFormat("mp4")
    .on('end',function(stdout, stderr){
      console.log("finish");
      console.log("stdout",stdout);
      console.log("stderr",stderr);
    })
    .on('error',function(err){
      console.log("err",err);
    })
  } catch (ex) {
    console.log("tesginas");
    next(ex);
  }
};
// const userKyc = () => {
//     const saveFile = async(req, res) => {
//         console.log("req",req.files);
//         if (req.files != null) {
//             if (req.files.name != undefined) {
//               var url = await fireBase.uploadImageToStorage(req.files.name);
//               console.log("url",url);
//               req.body.name = url
//             }
//         }
//     }
//     return{
//         saveFile
//     }
// }
// module.exports = userKyc;