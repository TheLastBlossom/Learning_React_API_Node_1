const validator = require("validator");
const Article = require('../models/Article');
const validations = require('../helpers/validations');
const fs = require('fs');
const { error } = require("console");
const path = require('path');
const { response } = require("express");
const test = (req, res) => {
    return res.status(200).send({
        message: "Test ok"
    })
}
const createArticle = async (req, res) => {

    let { title, content } = req.body;
    try {
        validations.validateDataArticles(title, content);
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            status: "400",
            message: "No valid data"
        });
    }
    try {
        let reg = await Article.create({
            title: title,
            content: content
        });
        return res.status(200).json({
            status: "Success",
            message: "The article was created successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: "Internal Server Error",
            message: "Error retrieving articles. Please try again later."
        });
    }
}
const getArticles = async (req, res) => {
    let articles;
    try {
        if (req.params.limit === undefined) {
            articles = await Article.find().sort({ createdAt: -1 })
        } else {
            articles = await Article.find().sort({ createdAt: -1 }).limit(req.params.limit)
        }

        if (!articles || articles.length === 0) {
            return res.status(404).json({
                status: "Not Found",
                message: "No articles found"
            });
        }

        return res.status(200).json({
            status: "Success",
            length: articles.length,
            message: articles
        });
    } catch (error) {
        console.error("Error retrieving articles:", error);

        return res.status(500).json({
            status: "Internal Server Error",
            message: "Error retrieving articles. Please try again later."
        });
    }
};

const findOneArticle = async (req, res) => {
    try {
        let reg = await Article.findById(req.params.id);
        if (reg != null) {
            return res.status(200).send({
                status: "Success",
                message: reg
            });
        } else {
            return res.status(400).send({
                status: "Not Found",
                message: "Article not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "Internal Server Error",
            message: "Error retrieving articles. Please try again later."
        });
    }
}
const deleteArticle = async (req, res) => {
    try {
        let reg = await Article.findByIdAndDelete(req.params.id);
        if (reg != null) {
            return res.status(200).send({
                status: "Delete success",
                message: reg
            });
        } else {
            return res.status(400).send({
                status: "Not Found",
                message: "Article not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "Internal Server Error",
            message: "Error retrieving articles. Please try again later."
        });
    }
}

const updateArticle = async (req, res) => {
    let { title, content } = req.body;
    try {
        await validations.validateDataArticles(title, content);
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            status: "400",
            message: "No valid data"
        });
    }
    try {
        let reg = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (reg != null) {
            return res.status(200).json({
                status: "Update success",
                message: reg
            });
        } else {
            return res.status(400).json({
                status: "Not Found",
                message: "Article not found"
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: "Internal Server Error",
            message: "Error retrieving articles. Please try again later."
        });
    }
}

const uploadImage = async (req, res) => {
    try {
        const { originalname, path, filename } = req.file;
        let name_splited = originalname.split('\.');
        console.log(name_splited);
        let extension = name_splited[1];
        if (extension != "png" && extension != "jpg" &&
            extension != "jpeg" && extension != "gif") {
            fs.unlink(path, (error) => {
                if (error) throw new Error(error);
            })
            return res.status(400).send({
                status: "Not valid",
                message: "The extension is not valid",
                file: req.file.originalname
            });
        } else {
            try {
                let reg = await Article.findByIdAndUpdate(req.params.id, { image: filename }, { new: true });
                if (reg != null) {
                    return res.status(200).json({
                        status: "Update success",
                        message: reg
                    });
                } else {
                    return res.status(400).json({
                        status: "Not Found",
                        message: "Article not found"
                    });
                }

            } catch (error) {
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Error retrieving articles. Please try again later."
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: "Internal Server Error",
            message: "Error retrieving articles. Please try again later."
        });
    }
}
const getImage = (req, res) => {
    try {
        let lpath = "./upload/images-articles/" + req.params.image_name;
        fs.stat(lpath, (error, response) => {
            if (response) {
                return res.sendFile(path.resolve(lpath));
            } else {
                return res.status(404).json({
                    status: "Not Access",
                    message: "The image could not be obtained"
                });
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: "Internal Server Error",
            message: "Error retrieving articles. Please try again later."
        });
    }
};

const search = async (req, res) => {
    try {
        let reg = await Article.find({
            "$or": [
                { "title": { "$regex": req.params.to_search, "$options": "i" } },
                { "content": { "$regex": req.params.to_search, "$options": "i" } }
            ]
        });
        if (reg.length > 0) {
            return res.status(200).json({
                status: "Success",
                message: reg
            });
        } else {
            return res.status(400).json({
                status: "Not Found",
                message: "No coincidences were found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "Internal Server Error",
            message: "Error retrieving articles. Please try again later."
        });
    }
}

module.exports = {
    test,
    createArticle,
    getArticles,
    findOneArticle,
    deleteArticle,
    updateArticle,
    uploadImage,
    getImage,
    search
}