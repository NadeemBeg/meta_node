const sgMail = require('@sendgrid/mail');
const User = require("../models/userModel");
const sendgridAPIKey = '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';
sgMail.setApiKey(sendgridAPIKey);

module.exports.sendEmail = async (req, res, next) => {
    try {
        var val = Math.floor(1000 + Math.random() * 9000);
        console.log("val",val);
        const email = req.body.email;
        const otp = val;
        if(email == null || email == undefined || email == ''){
            return res.status(201).json({
                status:201,
                message:"Email Not Found"
            });
        }
        else{
            const msg =
            {
                to: `${email}`,
                from: 'cto@aarchik.com',
                subject: 'OTP for Document View',
                Text: `Your OTP is ${otp}`
            }
            sgMail.send(msg, function (err, json) {
                if (err) {
                    console.log(err.body)
                    return res.status(201).json({
                        code: 200,
                        success: false,
                        message: `email not send.`,
                        data: {}
                    });
                } else {
                    console.log('done');
                    User.findOneAndUpdate({email:email},{otp:otp},(err,updatedata)=>{
                        if(err){
                            return res.status(200).json({
                                code: 201,
                                success: false,
                                message: `OTP not sent.`,
                                data: {}
                            });
                        }
                        else{
                            // console.log("updatedata",updatedata);
                            if(!updatedata){
                                return res.status(200).json({
                                    code: 201,
                                    success: false,
                                    message: `OTP not sent.`,
                                    data: {}
                                });
                            }else{
                                return res.status(200).json({
                                    code: 200,
                                    success: true,
                                    message: `OTP sent successfully.`,
                                    data: {}
                                });
                            }
                        }
                    });
                }
            });
        }     
    } catch (ex) {
      next(ex);
    }
};
module.exports.otpVerify = async (req, res, next) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        if(email == null || email == undefined || email == ''){
            return res.status(201).json({
                status:201,
                message:"Email Not Found"
            });
        }
        else{
            User.findOne({email:email},(err,updatedata)=>{
                if(err){
                    return res.status(200).json({
                        code: 201,
                        success: false,
                        message: `Something Want Wrong.`,
                        data: {}
                    });
                }
                else{
                    // console.log("updatedata",updatedata);
                    if(!updatedata){
                        return res.status(200).json({
                            code: 201,
                            success: false,
                            message: `Something Want Wrong.`,
                            data: {}
                        });
                    }else{
                        if(updatedata.otp == otp){
                            User.findOneAndUpdate({email:email},{otp:null},(err,updateOTP)=>{
                                if(err){
                                    return res.status(200).json({
                                        code: 201,
                                        success: false,
                                        message: `OTP not sent.`,
                                        data: {}
                                    });
                                }
                                else{
                                    return res.status(200).json({
                                        code: 200,
                                        success: true,
                                        message: `OTP successfully verify.`,
                                        data: {}
                                    });
                                }
                            });
                            
                        }
                        else{
                            return res.status(200).json({
                                code: 201,
                                success: false,
                                message: `OTP mismatch.`,
                                data: {}
                            });
                        }
                    }
                }
            });
        }     
    } catch (ex) {
      next(ex);
    }
};