var express = require("express");
const path = require("path");

const pdfRouter = require("./router");
var app = express();

app.use(express.json());
app.use("/output", express.static(path.join(__dirname,'otuput')));

app.use("/",pdfRouter);

app.listen(3000, () => {
    console.log("Server connect success");
})