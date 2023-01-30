const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password, metamask, device_token } = req.body;
    var user = await User.findOne({ metamask });
    if (!user)
      return res.json({ msg: "Incorrect Metamask Address", status: false });
    if (user.username !== username)
      return res.json({ msg: "Incorrect Username", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Password", status: false });
    // if (!device_token)
    //   return res.json({ msg: "Device Token not Found", status: false });
    const updateDeviceToken = await User.findOneAndUpdate({ metamask },{device_token: device_token});
    if(!updateDeviceToken)
      return res.json({ msg: "Device Token not Update Successfully", status: false });
    const updatedUser = await User.findOne({ metamask });
    user = updatedUser
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password, metamask, device_token } = req.body;
    if(username.trim() == "" || username.trim() == null){
      return res.json({ msg: "Please Enter Username", status: false });
    }
    var checkEmail =  email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if(!checkEmail){
      return res.json({ msg: "Please Enter Email", status: false });
    }
    if(password == "" || password == null){
      return res.json({ msg: "Please Enter Password", status: false });
    }
    if(metamask == "" || metamask == null){
      return res.json({ msg: "Please Enter Metamask", status: false });
    }
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const metamaskCheck = await User.findOne({ metamask });
    if (metamaskCheck)
      return res.json({ msg: "Metamask Address already used", status: false });
    // if (!device_token)
    //   return res.json({ msg: "Device Token not Found", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username :username.trim(),
      password: hashedPassword,
      metamask,
      device_token
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({$or:[{ _id: { $ne: req.params.id } },{ email: { $ne: req.params.id } }]} ).select([
      "email",
      "username",
      "avatarImage",
      "_id",
      "metamask",
      "device_token",
      "newMsgUserId",
      "chatTime"
    ]);

       // --------------------------**------------------ blinking
    // console.log("");

    // var arrOne  = []; var arrTwo = []
    // users.map((contactUser)=>{
    //   // if(contactUser.newMsgUserId.length > 0)
    //   // console.log("contactUser.newMsgUserId.include(id)");
    //   if(contactUser.newMsgUserId.includes(req.params.id)){
    //     // console.log("contactUser",contactUser);
    //     arrOne.push(contactUser);
    //   }
    //   else{
    //     arrTwo.push(contactUser);
    //   }
    // })
    // // console.log("arrOne",arrOne,"arrTwo",arrTwo);
    // const merged = [...arrOne, ...arrTwo];
    // console.log("merged",merged[0]);
    // console.log("users",users);
    let userData = users.sort(function(a,b){
        return new Date(b.chatTime) - new Date(a.chatTime)
    })
    // console.log("userData",userData);

     var arrOne  = []; var arrTwo = []
     userData.map((contactUser)=>{
      // if(contactUser.newMsgUserId.length > 0)
      // console.log("contactUser.newMsgUserId.include(id)");
      if(contactUser.newMsgUserId.includes(req.params.id)){
        // console.log("contactUser",contactUser);
        arrOne.push(contactUser);
      }
      else{
        arrTwo.push(contactUser);
      }
    })
    // console.log("arrOne",arrOne,"arrTwo",arrTwo);
    const merged = [...arrOne, ...arrTwo];

    return res.json(merged);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getUserByEmail = async (req, res, next) => {
  try {
    console.log("req.params.id",req.body.email);
    const users = await User.findOne({ email: req.body.email } ).select([
      "email",
      "username",
      "_id",
      "metamask",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
module.exports.updateUser = async (req, res, next) => {
  try {
    // console.log("req.body",req.body);
    const finddata = await User.findOne({_id: req.body.id, newMsgUserId:{$in:[req.body.newMsgUserId]}});
    // console.log("finddata for update",finddata);
    if(finddata == null){
      const users = await User.findOneAndUpdate({ _id: req.body.id },{$set:{chatTime:new Date()},$push:{newMsgUserId:req.body.newMsgUserId}});
      console.log("users done Upate",users);
      return res.json(users);
    }
    else{
      const users = await User.findOneAndUpdate({ _id: req.body.id },{$set:{chatTime:new Date()}});
      console.log("users done Upate",users);
      return res.json(users);
    }
    return res.json('');
  } catch (ex) {
    next(ex);
  }
};
module.exports.msguserIdRemove = async (req, res, next) => {
  try {
    const finddata = await User.findOne({_id: req.body.id, newMsgUserId:{$in:[req.body.newMsgUserId]}});
    // console.log("finddata",finddata);
    if(finddata){
      const users = await User.findOneAndUpdate({ _id: req.body.id },{$pull:{newMsgUserId:req.body.newMsgUserId}});
      var updateData = await User.findOne({ _id: req.body.id });
      console.log("updateData",updateData);

      return res.json(users);
    }
    return res.json('');
  } catch (ex) {
    next(ex);
  }
};