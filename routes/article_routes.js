const express = require("express");
const router = express.Router();
const multer = require("multer");
const article_controller = require("../controllers/article_controller");

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './upload/images-articles/');
    },
    filename: (req, file, cb)=>{
        cb(null, "article" + Date.now() + file.originalname);
    }
});

const uploads = multer({storage: storage});

router.get("/test", article_controller.test);
router.post("/create-article", article_controller.createArticle);
router.get("/get-articles/:limit?", article_controller.getArticles);
router.get("/get-article/:id", article_controller.findOneArticle);
router.delete("/delete-article/:id", article_controller.deleteArticle);
router.put("/update-article/:id", article_controller.updateArticle);
router.post("/upload-image/:id",[uploads.single('image')], article_controller.uploadImage);
router.get("/get-image/:image_name", article_controller.getImage);
router.get("/search/:to_search", article_controller.search);

module.exports = router;