const express = require('express');
const router = require('./routes/pdf.route');

const app = express();

app.use('/public',express.static('public'));

app.use('/pdf',router);

 app.use((err, req, res, next) => {
    res.status(500).json({
        error: true,
        details: err
    })
});



app.listen(3000,()=>{
    console.log('Server is running on 3000');
})