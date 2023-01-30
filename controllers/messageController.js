const Messages = require("../models/messageModel");
const axios = require('axios');

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projectedMessages = messages.map((msg) => {
      let resData = {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        createdAt: msg.createdAt,
      };
      if (msg.message.text_length) {
        resData.text_length = msg.message.text_length;
      }
      if (msg.message.docUrl) {
        resData.docUrl = msg.message.docUrl;
      }
      return resData;
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message, text_length, docUrl } = req.body;
    var device_token = req.body.device_token
    // console.log("req.body",req.body);
    // var requestData ={
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'key=AAAAG1ZAi6w:APA91bH4814rU20cMHFTAj9FAk42fGyeuXwGGJ6-kuqNn-9J37jEtdqmXHNtLOAVDcQhGClxMpoSrQsVk6eA0PDXuV-YFGTleFBDJ2BQto2zDN9vL1aInW3QVzw9emSirqHX4pLY3K2B'
    //   },
    if(device_token == null || device_token == "" || device_token == undefined){
      console.log("device_token",device_token);
      device_token = null
    }
    var bodyFormData = {
      "notification": {
        "title": "Chat",
        "body": message,
      },
      "to": device_token
    }
    // }

    const data = await Messages.create({
      message: { text: message, docUrl:docUrl, text_length },
      users: [from, to],
      sender: from,
    });
    // console.log("data",data);

    if (data && device_token) {
      // console.log("THERE");
     var a = await axios({
        method: 'post',
        url: 'https://fcm.googleapis.com/fcm/send',
        data: JSON.stringify(bodyFormData),
        headers: { 'Content-Type': ' application/json', 'Authorization': 'key=AAAAG1ZAi6w:APA91bH4814rU20cMHFTAj9FAk42fGyeuXwGGJ6-kuqNn-9J37jEtdqmXHNtLOAVDcQhGClxMpoSrQsVk6eA0PDXuV-YFGTleFBDJ2BQto2zDN9vL1aInW3QVzw9emSirqHX4pLY3K2B' }
      });
      // console.log("a ",a );
      // return res.json({ msg: "Message added successfully." });
      return res.json({ msg: "Message added successfully.",data: data
       });
    }
    else if(data){
      return res.json({ msg: "Message added successfully.",data: data})
    }
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getFirebaseMsg = async (req, res, next) => {
  var ids = []
   Messages.find({"message.text": { '$regex' : "firebasestorage.googleapis.com/", '$options' : 'i' } },(err,data)=>{
    console.log("err",err);
    // console.log("Data",data);
    if(data){
      data.map((msg) => {
        var a = Math.abs(new Date() - new Date(msg.createdAt));
        const diffDaysdfasds = Math.ceil(a / (1000 * 60 * 60 * 24));
        console.log("diffDaysdfasds",diffDaysdfasds);
        if(diffDaysdfasds > 42){
          ids.push(msg._id);
        }
      });
      console.log("ids",ids);
    }
  });
}