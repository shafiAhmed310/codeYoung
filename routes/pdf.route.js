const router = require('express').Router();
const addPdf = require('../controllers/pdf.controllers');
const storage = require('../middleware/storage');


router.post('/add-pdf',storage.single('pdf'),addPdf);

module.exports = router;