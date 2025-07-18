var fs = require("fs");
var path = require("path");
var pdfDoument = require("pdfkit");

const generateCertificate = ({name, dob, gender,bloodGroup, dateTime, registerId, email, phone, address,logoPath,sealPath,outputPath}) => {
    return new Promise((resolve, reject) => {
        const doc = new pdfDoument({size : 'A4',margin : 50});
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(fs.createWriteStream(outputPath));
        console.log(stream, "stream", "outputPath : ",outputPath);
        
        doc.pipe(stream);
        doc.rect(20, 20, doc.page.width - 30, doc.page.height - 40).lineWidth(8).stroke("#00AEEF");
        doc.fontSize(10).fillColor('black');
        doc.text(`Register-Id : ${registerId}`, 50, 50);
        doc.text(`E-Mail : ${email}`,50, 65);
        doc.text(`Phone No : ${phone}`, 50, 80);

        doc.text(address, doc.page.width - 200, 50, {
            width : 140,
            align : 'right'
        });

        doc.image(logoPath, doc.page.width / 2 - 30,70 , {width : 60});

        let startY = 150;
        doc.font('Times-Bold').fontSize(24).fillColor('#00AEEF');
        doc.text('Certificate of Half Marathon', 0, startY, {align : 'center'});

        doc.moveDown(1);
        doc.fontSize(15).fillColor('black').font('Times-Bold');
        doc.text('This Certificate Presented to', {align : 'center'});

        doc.moveDown(0, 2);
        doc.fontSize(16).fillColor('#FF5733').font("Times-Bold");
        doc.text(name, {align : "center"});

        doc.moveDown(0.4);
        doc.fontSize(11).fillColor('black').font('Times-Roman');
        doc.text('The certificate of achievement is awarded to individuals who have\n' + 'demonstrated outstanding performance in their field. Here’s an example text\n' + 'for a certificate.\n',{align : 'center',lineGap : 4});

        doc.moveDown(2);
        const infoY = doc.y;
        doc.fontSize(11);
        doc.text(`Date of Birth : ${dob}`, 50 , infoY);
        doc.text(`Gender : ${gender}`, 250 , infoY);
        doc.text(`Blood Group : ${bloodGroup}`, 420 , infoY);

        doc.moveDown(8);
        const dty = doc.y;
        doc.text(`${dateTime}`, 60, dty);
        doc.text('DATE-TIME', 60, dty + 15);

        doc.image(sealPath, doc.page.width / 2 - 40, dty + 5, {width : 60});

        doc.fontSize(8);
        doc.text('____________',460,dty, + 15)
        doc.text('SIGNATURE',460, dty + 15)

        // const outp

        doc.end();
        stream.on('finish', () => resolve());
        stream.on("/error", reject)
    })
}
const createPdfCode = async (request, response) => {
    const {name, dob, gender,bloodGroup, dateTime, registerId, email, phone, address} = request.body;
    try {        
        if(!name ||  !dob || !gender|| !bloodGroup || !dateTime || !registerId || !email || !phone || !address) {
            return response.status(200).json({sucess : false, msg : "Please send data", key : "name, dob, gender,bloodGroup, dateTime, registerId, email, phone, address"})
        }
        const fileName = `${Date.now()}_certificate.pdf`;
        const outputPath = path.join(__dirname, 'output', fileName)
        await generateCertificate({name, dob, gender,bloodGroup, dateTime, registerId, email, phone, address,logoPath : path.join(__dirname, "assets",'logo.png'),sealPath : path.join(__dirname, 'assets', "seal.jpg"),outputPath});
        console.log("fileName : ",fileName);
        
        const PublicUrl = `${request.protocol}://${request.get('host')}/output/${fileName}`;
        return response.status(200).json({sucess : true, msg : "PDF created Successfully",url :  path.join(__dirname, "output",fileName),PublicUrl : PublicUrl})
    } catch (error) {
        return response.status(200).json({sucess: false,msg: error.message})
    }
}
module.exports = createPdfCode;