const path = require('path');
const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');

const addPageNumbersController = async (req, res) => {
  const filePath = req.file.path;
  const outputFile = `page_numbered_${Date.now()}.pdf`;
  const outputPath = path.join(__dirname, '..', 'uploads', outputFile);

  try {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const text = `${index + 1}`;

      // Approximate text width: font size * number of characters (simple estimation)
      const fontSize = 12;
      const textWidth = text.length * fontSize * 0.6; // 0.6 is a rough approximation factor

      // Calculate x position to center the text
      const x = (width - textWidth) / 2;
      const y = 20; // Position the text 20 units from the bottom

      page.drawText(text, {
        x: x,
        y: y,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    });

    const modifiedBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, modifiedBytes);

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
    res.status(500).send('Error adding page numbers');
  }
};

module.exports = addPageNumbersController;
