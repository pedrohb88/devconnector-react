const multer = require('multer');
const MulterGoogleStorage = require('multer-google-storage');

const uploadHandler = multer({
    storage: MulterGoogleStorage.storageEngine()
});

module.exports = uploadHandler;