const knex= require("knex");

const express = require("express")
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require("bcrypt")
const {generateToken,authenticateToken, authorization} = require('./auth/jwt')

// const roles = {a:"admin",b:"user"}

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
});

// ADDING NEW USER
router.post("/signup",async (req,res)=>{
    try{
        const pass = await bcrypt.hash(req.body.password, 10);
        const y = {
        id:req.body.id,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        password:pass
        }
        const data =  knex("users").insert(y)
        console.log("user added succcesfull")
        res.send("user added succesfull")
    }
    catch(err){
        res.send({err:err.message})
        console.log(err)
    }
})


// USER LOGIN
// router.post("/login",async(req,res)=>{
//     try{
//         const userdata = await knex.select("*").from("users").where('email',req.body.email)
//         if(userdata){
//             const compare = await bcrypt.compareSync(req.body.password,userdata.password)
//             if(compare){
//                 const token = generatteToken(req.body)
//                 res.send(token)
//                 console.log("login succesfull",token)
//             }else{
//                 console.log("wrong password entered")
//                 res.send("wrong password entered")
//             }
//         }else{
//             res.send("user not found")
//             console.log("user not found")
//         }
//     }
//     catch(err){
//         res.send(err)
//         console.log(err)
//     }
// })

router.post("/login",(req,res)=>{
    if(req.body.email === undefined || req.body.password === undefined){
        res.send("both email and password are required")
    }else{
        knex.select("*").from("admin").where('email',req.body.email).then((data)=>{
            const password =req.body.password
            if(password){
                const token = generateToken(data)
                res.send(token)
                const y  =x(token)
                // const z = y.userData['email']
                console.log(y,token,data)

            }else{
                res.send("invalid password")
            }
        }).catch((err)=>{
            res.send(err)
        })
    }
})

// POSTIBG TETSIMONIAL
router.post("/test",authenticateToken,authorization(["admin"]), upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename
    const x = {
        id:req.body.id,
        title:req.body.title,
        image:imgsrc,
        description:req.body.description,
        status:req.body.status,
        created_by:req.body.created_by,
        updated_by:req.body.updated_by
    }
        knex("testimonial").insert(x).then((data)=>{
            res.send("testimonial added")
        }).catch((err)=>{
            res.send(err)
        })
    }
});

// GET TESTiMONIAL

router.get("/test",authenticateToken,authorization(["admin"]),(req,res)=>{
    knex.select("*").from("testimonial").then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

// GET TESTiMONIAL BY ID
router.get("/test/:id",authenticateToken,authorization(["admin"]),(req,res)=>{
    knex.select("*").from("testimonial").where("id",req.params.id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

// UPDATE TESTiMONIAL
router.put("/test/:id",authenticateToken,authorization(["admin"]),(req,res)=>{
    knex.select("*").from("testimonial").where("id",req.params.id).update(req.body).then((data)=>{
        res.send("post updated")
    }).catch((err)=>{
        res.send(err)
    })
})

// DELETE TESTiMONIAL BY ID
router.delete("/test/:id",authenticateToken,authorization(["admin"]),(req,res)=>{
    knex.select("*").from("testimonial").where("id",req.params.id).del().then((data)=>{
        res.send("post deleted")
    }).catch((err)=>{
        res.send(err)
    })
})


// POST GALLERY IMAGES

router.post("/gal",authenticateToken,authorization(["admin"]), upload.array('image',5), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename
    const x = {
        id:req.body.id,
        image:imgsrc,
        status:req.body.status,
        created_by:req.body.created_by,
        updated_by:req.body.updated_by
    }
        knex("gallery").insert(x).then((data)=>{
            res.send("gallery added")
        }).catch((err)=>{
            res.send(err)
        })
    }
});

// GET GALLERY

router.get("/gal",authenticateToken,authorization(["admin"]),(req,res)=>{
    knex.select("*").from("gallery").then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

// GET GALLERY BY ID
router.get("/gal/:id",authenticateToken,authorization(["admin"]),(req,res)=>{
    knex.select("*").from("gallery").where("id",req.params.id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

// UPDATE GALLERY
router.put("/gal/:id",authenticateToken,authorization(["admin"]),(req,res)=>{
    knex.select("*").from("gallery").where("id",req.params.id).update(req.body).then((data)=>{
        res.send("gallery updated")
    }).catch((err)=>{
        res.send(err)
    })
})

// DELETE GALLERY BY ID
router.delete("/gal/:id",authenticateToken,authorization(["admin"]),(req,res)=>{
    knex.select("*").from("gallery").where("id",req.params.id).del().then((data)=>{
        res.send("post deleted")
    }).catch((err)=>{
        res.send(err)
    })
})


module.exports = router