const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const jpgToPdfController = async (req, res) => {
  const originalFileName = req.file.originalname;
  const imagePath = req.file.path;
  const pdfFileName = originalFileName.replace(/\.[^.]+$/, '.pdf');
  const pdfPath = path.join(__dirname, '..', 'uploads', pdfFileName);

  try {
    const pdfDoc = await PDFDocument.create();
    const imageBytes = fs.readFileSync(imagePath);
    const image = await pdfDoc.embedJpg(imageBytes);
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0 });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, pdfBytes);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(pdfFileName)}"`);
    res.sendFile(pdfPath);

    setTimeout(() => {
      try {
        fs.unlinkSync(imagePath);
        fs.unlinkSync(pdfPath);
        console.log(`Deleted files: ${imagePath}, ${pdfPath}`);
      } catch (err) {
        console.error(`Error deleting files: ${err}`);
      }
    }, 600000);
  } catch (err) {
    console.error('Error converting image to PDF:', err);
    res.status(500).send('Error converting image to PDF.');
  }
};

module.exports = jpgToPdfController;
