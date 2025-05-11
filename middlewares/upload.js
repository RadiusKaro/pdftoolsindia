const multer = require('multer');
const path = require('path');

// Allowed file types
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'image') {
    if (ext === '.jpg' || ext === '.jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg/.jpeg images are allowed!'));
    }
  } else if (file.fieldname === 'pdf' || file.fieldname === 'pdfs') {
    if (ext === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf files are allowed!'));
    }
  } else {
    cb(new Error('Invalid file field!'));
  }
};

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 15 * 1024 * 1024 // 5 MB limit
  },
  fileFilter
});

module.exports = upload;
