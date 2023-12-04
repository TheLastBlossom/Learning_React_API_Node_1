const express = require("express");
const cors = require("cors");
const app = express();
const port = "4000";
//database connection
const {connection} = require('./connection_database');
const article_routes = require('../routes/article_routes');
app.use(cors());
app.use(express.json());//To convert a body to a JSON type
app.use(express.urlencoded({extended:true}));//to allow x-www-form-unlencoded
// app.get("/test",(req,res)=>{
//     return res.status(200).send(`
//     <h1>Hello</h1>
//     `);
// })
app.use("/api", article_routes);
app.listen(port, async()=>{
    await connection();
    console.log("The server is running on the port: " + port);
})