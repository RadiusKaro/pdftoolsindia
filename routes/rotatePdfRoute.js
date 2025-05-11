const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const rotatePdfController = require('../controllers/rotatePdfController');

router.post('/api/rotate-pdf', upload.single('pdf'), rotatePdfController);

module.exports = router;
