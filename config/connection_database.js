const mongoose = require("mongoose");
const connection = async()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/learning_react_db_blog");
        console.log("Connection to the database successful");
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
        throw error;
    }
}
module.exports = {
    connection
}
