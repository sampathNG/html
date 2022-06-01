// require("dotenv").config()
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const jwt = require("jsonwebtoken")

function generateToken(userData){
    const token =jwt.sign({userData},process.env.SECRET)
    return token
}

function authenticateToken(req,res,next){
    try{
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
        jwt.verify(token,process.env.SECRET,(err)=>{
        if(err){
            console.log({err:err.meassage})
            res.send(err)
        }
        // req.data = data

        next()
    })
    }
    catch(err){
        console.log(err)
    }
}

const authorization = (permissions) => {
    return (req,res,next) => {
        const userRole = req.body.role
        if(permissions.includes(userRole)){
            next()
        }else{
            return res.status(401).json("you dont have permission")
        }
    }

}
//  authorization(["admin"])
// console.log(process.env.SECRET)
module.exports = {generateToken,authenticateToken,authorization}