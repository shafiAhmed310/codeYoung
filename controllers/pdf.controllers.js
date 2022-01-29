const pdfreader = require("pdfreader");
const PDFDocument = require('pdfkit');
const fs = require('fs');



var rows = {}; 
let arr = [];
  const filesPrint = async(filesUploaded)=> {
    return new Promise((resolve, reject) => {
      new pdfreader.PdfReader().parseFileItems(
        `uploads/${filesUploaded}`,
        function (err, item) {
          if (!item || item.page) {
            Object.keys(rows)
              .sort((y1, y2) => parseFloat(y1) - parseFloat(y2))
              .forEach((y) => {
                resolve((obj = Object.assign({}, rows[y])), arr.push(obj));
              });
            reject(arr.length <= 0);
            rows = {};
          } else if (item.text) {
            (rows[item.y] = rows[item.y] || []).push(item.text);
          }
        }
      );
    });
  }
  
const addPdf = async (req,res,next)=>{
    try {
        const pdf = req.file;
        try {
            let data = await filesPrint(pdf.filename);
        } catch (error) {
            next(error.message)
        }
         let date = new Date(req.body.date);
         let pdfValues = [];
        let modifiedDate =  date.toDateString();
        arr.forEach(ele=>{
          let values = Object.values(ele);
          pdfValues.push(values)
        });
        
        let pdfData  =pdfValues.flat();

        for (let i = 0; i < pdfData.length; i++) {
          const element = pdfData[i];
          if(element.length<=1){
          let data =  pdfData[i].concat(pdfData[i+1]);
          pdfData.splice(i,1,data);
          pdfData.splice(i+1,1)
          }
          
        }
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(`public/${pdf.filename}`));
        doc.fontSize(13).text(modifiedDate, 40, 100)
        doc.fontSize(13).text(pdfData[3], 220, 140).underline(220, 140, 170, 17, {
          color: '#111'
      })
        doc.fontSize(13).text(pdfData[4].concat(pdfData[5]), 60, 210)
        doc.fontSize(13).text(pdfData[6], 60, 240)
        doc.fontSize(13).text(pdfData[7], 60, 360)
        doc.fontSize(13).text(pdfData[8], 60, 400)
        doc.fontSize(13).text(pdfData[9], 60, 420)
        doc.fontSize(13).text(pdfData[10], 60, 440)
        doc.fontSize(13).text(pdfData[11], 60, 460)
        doc.end();
        let path = `http://localhost:3000/public/${pdf.filename}`
        res.status(200).json({error:false,message:"Pdf upload successfully",response:path})
    } catch (error) {
         next(error.message)
    }
      }

      module.exports= addPdf;