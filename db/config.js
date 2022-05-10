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

knex.schema.createTable("users",(t)=>{
    t.increments("user_id").primary(),
    t.string("first_name"),
    t.string("last_name"),
    t.string("email_id"),
    t.string("password"),
    t.timestamp("created_at").defaultTo(knex.fn.now()),
    t.timestamp("updated_at").defaultTo(knex.fn.now())
}).then((data)=>{
    console.log("table created")
}).catch((err)=>{
    console.log("table alfeady exists")
})

knex.schema.createTable("testimonial",(t)=>{
    t.increments().primary(),
    t.string("title"),
    t.string("image"),
    t.string("description"),
    t.string("status"),
    t.string("created_by"),
    t.string("updated_by")
    t.timestamp("created_at").defaultTo(knex.fn.now()),
    t.timestamp("updated_at").defaultTo(knex.fn.now())
}).then((data)=>{
    console.log("table created")
}).catch((err)=>{
    console.log("table already exists")
})

knex.schema.createTable("gallery",(t)=>{
    t.increments().primary(),
    t.string("image"),
    t.string("status"),
    t.string("created_by"),
    t.string("updated_by")
    t.timestamp("created_at").defaultTo(knex.fn.now()),
    t.timestamp("updated_at").defaultTo(knex.fn.now())
}).then((data)=>{
    console.log("table created")
}).catch((err)=>{
    console.log("table already exists")
})

module.exports = knex;