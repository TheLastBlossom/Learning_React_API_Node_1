const validator = require("validator");

const validateDataArticles = (title, content)=>{    
    let title_validated = !validator.isEmpty(title) && validator.isLength(title, { min: 5, max: 100 });
    let content_validated = !validator.isEmpty(content);
    if (!title_validated || !content_validated) {
        throw new Error("No valid data");
    }
}

module.exports = {
    validateDataArticles
};