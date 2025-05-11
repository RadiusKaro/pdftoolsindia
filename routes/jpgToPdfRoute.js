const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const jpgToPdfController = require('../controllers/jpgToPdfController');

router.post('/api/jpg-to-pdf', upload.single('image'), jpgToPdfController);

module.exports = router;
