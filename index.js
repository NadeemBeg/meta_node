const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const fileRoutes = require('./routes/fileSave');
const sendEmailRoutes = require('./routes/sendEmail');
const app = express();
const socket = require("socket.io");
require("dotenv").config();
const fileUpload = require('express-fileupload');
const Messages = require("./models/messageModel");
const fireBase = require('./helper/fireStoragedetails');
app.use(cors());
app.use(express.json());
app.use(fileUpload());

mongoose
  .connect('mongodb+srv://nadeembeg:wCcdYeqtCM0Pw0tv@desoapp.5y4enph.mongodb.net/wallet-chat?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/document", fileRoutes);
app.use("/api/email", sendEmailRoutes);


const server = app.listen(5005, () =>
  console.log(`Server started on ${5005}`)
);
const io = socket(server, {
  cors: {
    // origin: "http://localhost:3000",
    // origin:"https://wallet.aarchik.com/",
    // credentials: true,
    origin: '*',

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE'
    ],

    allowedHeaders: [
      'Content-Type',
    ],
  },
});

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    '*'
  ],
};

app.use(cors(corsOpts));

setInterval(() => {
  console.log("setInterval");
  var ids = [];
  var urls = [];
  Messages.find({"message.text": { '$regex' : "firebasestorage.googleapis.com/", '$options' : 'i' } }, async(err,data)=>{
  console.log("err",err);
  // console.log("Data",data);
  if(data){
    data.map(async(msg) => {
      var a = Math.abs(new Date() - new Date(msg.createdAt));
      const diffDaysdfasds = Math.ceil(a / (1000 * 60 * 60 * 24));
      console.log("diffDaysdfasds",diffDaysdfasds);
      if(diffDaysdfasds > 2){
        ids.push(msg._id);
        await fireBase.deleteImageToStorage(msg.message.text);
        urls.push(msg.message.text);
        await Messages.deleteOne({_id:msg._id})
      }
    });
    // await Messages.deleteMany({_id:{$in:ids}},(err,result)=>{
    //   if(err){
  
    //   }
    //   else{
    //     console.log("old's url deleted");
    //   }
    // })
    // console.log("urls",urls);
    // var bucket = 'gs://messagingapp-3b949.appspot.com';
    // admin.initializeApp(firebaseConfig);
    // var fileUrl = 'gs://messagingapp-3b949.appspot.com/files%2F8370053945.png';
    // var storage = admin.storage().bucket(bucket);
    // storage = storage.ref();
    // // Create a reference to the file to delete
    // var fileRef = storage.refFromURL(fileUrl);
    // fileRef.delete().then(function () {
    
    //   // File deleted successfully
    //   console.log("File Deleted")
    //   }).catch(function (error) {
    //       // Some Error occurred
    //   });
  
    // admin.storage().bucket(bucket).refFromURL("https://firebasestorage.googleapis.com/v0/b/messagingapp-3b949.appspot.com/o/files%2F8370053945.png?alt=media&token=7c7d4c9a-3ab3-4ca0-9d79-8ad00740fcd7").delete()
    // admin.storage().bucket(bucket).refFromURL(fileUrl).delete()
    // .then(function() {
    //     console.log("deleted successfully!");
    // })
    // .catch(function() {
    //     console.log("unable to delete");
    // });
  }
  });
}, 30000);



global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  });
});
