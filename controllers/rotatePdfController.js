const path = require('path');
const fs = require('fs');
const { PDFDocument, degrees } = require('pdf-lib');

const rotatePdfController = async (req, res) => {
  const { pagesToRotate } = req.body;

  if (!pagesToRotate) {
    return res.status(400).json({ error: 'pagesToRotate parameter is required. Example: "1,3"' });
  }

  const filePath = req.file.path;
  const outputFile = `rotated_${Date.now()}.pdf`;
  const outputPath = path.join(__dirname, '..', 'uploads', outputFile);

  try {
    const indices = pagesToRotate.split(',').map(i => parseInt(i.trim(), 10) - 1);

    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    indices.forEach(index => {
      if (pages[index]) {
        const rotation = pages[index].getRotation().angle + 90;
        pages[index].setRotation(degrees(rotation % 360));
      }
    });

    const rotatedBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, rotatedBytes);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${outputFile}"`);
    res.sendFile(outputPath);

    setTimeout(() => {
      try {
        fs.unlinkSync(filePath);
        fs.unlinkSync(outputPath);
        console.log(`Deleted files: ${filePath}, ${outputPath}`);
      } catch (err) {
        console.error(`Error deleting files: ${err}`);
      }
    }, 600000);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error rotating PDF pages');
  }
};

module.exports = rotatePdfController;
