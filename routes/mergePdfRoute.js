const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const mergePdfController = require('../controllers/mergePdfController');

router.post('/api/merge-pdf', upload.array('pdfs'), mergePdfController);

module.exports = router;
