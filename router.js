var expres = require("express");
const createPdfCode = require("./pdfController");
const upload = require("./multer");

var pdfRouter = expres.Router();

pdfRouter.post('/gererate-pdf',upload.none(),createPdfCode);
module.exports = pdfRouter;