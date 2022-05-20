const mysql2 = require("mysql2")
const knex = require('knex')({
client: 'mysql2',
connection: {
    host : 'localhost',
    user : 'kumar',
    password : 'Sampath@123',
    database : 'supagrow2'
}
});
const express = require("express")
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require("bcrypt")
const {generateToken,authenticateToken, authorization} = require('./auth/jwt')
const Joi = require('@hapi/joi')

// IMAGE STORAGE TO LOCAL DISK
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits:{
        fileSize:5242880
    }
});

// app. post('/contact', function(req, res){
//     res.render('contact', {qs: req.query});
//   });

// ADDING NEW USER
router.post("/signup",async (req,res)=>{
    try{
        const schema = Joi.object().keys({
            first_name:Joi.string().required(),
            last_name:Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });
        const Validation = schema.validate(req.body);
        console.log(req.body)
        const pass = await bcrypt.hash(req.body.password,10)
        req.body.password = pass
        console.log(pass)
        const data = await knex("users").insert(req.body)
        console.log("user added succcesfull")
        res.status(201).json("created")
        // res.json(req.body);
    }
    catch(err){
        res.send(err)
        console.log(err)
    }
})


// GET USERS

router.get("/user"
// ,authenticateToken,authorization(["admin"])
,(req,res)=>{
    knex.select("*").from("users").then((data)=>{
        res.send(data)
        console.log(data)
    }).catch((err)=>{
        res.send({err:err.message})
        console.log(err)
    })
})

// DELETE USER

router.delete("/testt/:user_id",
// authenticateToken,authorization(["admin"]),
(req,res)=>{
    knex.select("*").from("users").where({"user_id":req.params.user_id}).del().then((data)=>{
        res.send("post deleted")
    }).catch((err)=>{
        res.send(err)
    })
})


// LOGIN USER

router.post("/login",(req,res)=>{
    if(req.body.email === undefined || req.body.password === undefined){
        res.send("both email and password are required")
    }else{
        knex.select("*").from("users").where({'email':req.body.email}).then((data)=>{
            const compare =  bcrypt.compare(req.body.password,data.password)
            if(compare){
                const token = generateToken(req.body)
                res.send("login success")
                console.log(token)
            }else{
                res.send("invalid password")
            }
        }).catch((err)=>{
            res.send({err:err.message})
            console.log(err)
        })
    }
})


// POSTIBG TETSIMONIAL
router.post("/test",authenticateToken,
// authorization(["admin"]),
 upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log("No files uploaded");
        res.send("No files uploaded");
    } else {
        // console.log(req.file.filename)
        var imgsrc = 'http://127.0.0.1:5500/uploads/' + req.file.filename
        console.log(imgsrc)

    const schema = Joi.object().keys({
        title:Joi.string().required(),
        image:Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.string().required(),
        created_by: Joi.string().required(),
        updated_by: Joi.string().required()
    });
    const Validation = schema.validate(req.body);
    req.body.image = imgsrc
        knex("testimonial").insert(req.body).then((data)=>{
            res.send("testimonial added")
        }).catch((err)=>{
            res.send(err)
        })
    }
});



// GET TESTiMONIAL

router.get("/test",authenticateToken,
// authorization(["admin"]),
(req,res)=>{
    knex.select("*").from("testimonial").then((data)=>{
        res.send(data)
        console.log(data)
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
router.put("/test/:id",authenticateToken,
// authorization(["admin"]),
(req,res)=>{
    knex.select("*").from("testimonial").where("id",req.params.id).update(req.body).then((data)=>{
        res.send("post updated")
    }).catch((err)=>{
        res.send(err)
    })
})

// DELETE TESTiMONIAL BY ID
router.delete("/test/:id",authenticateToken,
// authorization(["admin"]),
(req,res)=>{
    knex.select("*").from("testimonial").where("id",req.params.id).del().then((data)=>{
        res.send("post deleted")
    }).catch((err)=>{
        res.send(err)
    })
})


// POST GALLERY IMAGES

router.post("/gal",authenticateToken,
// authorization(["admin"]),
upload.array('image',5), (req, res) => {
    if (!req.files) {
        console.log("No file upload");
    } else {
        console.log(req.files.filename)
        const x  = [req.files[0].filename,req.files[1].filename,req.files[2].filename,req.files[3].filename,req.files[4].filename]
        var imgsrc = 'http://127.0.0.1:5500/uploads/' + x

    const schema = Joi.object().keys({
        image:Joi.string().required(),
        status:Joi.string().required(),
        created_by: Joi.string().email().required(),
        updated_by: Joi.string().required()
    });
    const Validation = schema.validate(req.body);
    req.body.image = imgsrc
        knex("gallery").insert(req.body).then((data)=>{
            res.send("gallery added")
        }).catch((err)=>{
            res.send(err)
        })
    }
});

// GET GALLERY

router.get("/gal",authenticateToken,
// authorization(["admin"]),
(req,res)=>{
    knex.select("*").from("gallery").then((data)=>{
        res.send(data)
        console.log(data)
    }).catch((err)=>{
        res.send(err)
    })
})

// GET GALLERY BY ID
router.get("/gal/:id",authenticateToken,
// authorization(["admin"]),
(req,res)=>{
    knex.select("*").from("gallery").where("id",req.params.id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

// UPDATE GALLERY
router.put("/gal/:id",authenticateToken,
// authorization(["admin"]),
(req,res)=>{
    knex.select("*").from("gallery").where("id",req.params.id).update(req.body).then((data)=>{
        res.send("gallery updated")
    }).catch((err)=>{
        res.send(err)
    })
})

// DELETE GALLERY BY ID
router.delete("/gal/:id",authenticateToken,
// authorization(["admin"]),
(req,res)=>{
    knex.select("*").from("gallery").where("id",req.params.id).del().then((data)=>{
        res.send("post deleted")
    }).catch((err)=>{
        res.send(err)
    })
})


module.exports = router