'use strict';

const httpErrors = require('http-errors');
const users = require('./service');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const adduser = async (req, res) => {
    try {

        
        const checkExists = await users.viewuserdetails({email:req.body.email},{mobile:req.body.mobile})

        if(checkExists.length!=0){
            res.send({ status: 400, result: "Failure", message: 'User Already Exists!'}); 
            return false           
        }

        req.body.isActive = true;
        var date = new Date();

        req.body.createdOn=date.toISOString().slice(0,10) +" "+ date.toISOString().slice(11,19);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        const saveuser = await users.saveuserdetails(req.body)
        if(saveuser){
            res.send({ status: 200, result: "Success", message: 'User Added Successfully!'});
        }
        else{
            res.send({ status: 400, result: "Failure", Message: 'Some Thing Went Wrong!'});
        }

    } catch(err) {
        res.send({ status: 400, msg: 'Some Thing Went Wrong!'}); 
    }
};


const userlogin = async (req, res) => {
    try {

        const getUser = await users.viewuserdetails({username:req.body.username});

        if(getUser.length === 0)
        {
            res.send({ status: 400, result: "Failure", message: 'User Not Found!'}); 
            return false 
        }
     
        const match = await bcrypt.compare(req.body.password, getUser[0].password);
    
        if (match) { 
            const token = JWT.sign({ id: getUser[0].id,mobile:getUser[0].mobile,email:getUser[0].email }, process.env.JWT_SECRET_KEY);
            res.send({ status: 200, result:"Success" ,message: "LoggedIn Successfully!", accessToken: token });
        } else { 
            res.send({ status: 400, result:"Failure", message: "Incorrect Password!" });
        }

    } catch(err) {
        res.send({ status: 400, msg: 'Some Thing Went Wrong!'}); 
    }
};


module.exports = {
     adduser,
     userlogin,

     

};