const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const addPageNumbersController = require('../controllers/addPageNumbersController');

router.post('/api/add-page-numbers', upload.single('pdf'), addPageNumbersController);

module.exports = router;
