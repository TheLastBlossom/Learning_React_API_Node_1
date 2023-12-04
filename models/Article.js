'use strict'

const {Schema, model} = require('mongoose');
const ArticleSchema = Schema({
    title: {
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now        
    },
    image: {
        type: String,
        default: "default_image.png"
    }
});
module.exports = model("article", ArticleSchema);
