const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const mergePdfController = async (req, res) => {
  try {
    const files = req.files;
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const outputFile = `merged_${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, '..', 'uploads', outputFile);
    fs.writeFileSync(outputPath, mergedBytes);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${outputFile}"`);
    res.sendFile(outputPath);

    setTimeout(() => {
      try {
        files.forEach((file) => fs.unlinkSync(file.path));
        fs.unlinkSync(outputPath);
        console.log(`Deleted merged PDF and input files`);
      } catch (err) {
        console.error(`Error deleting files: ${err}`);
      }
    }, 600000);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error merging PDFs');
  }
};

module.exports = mergePdfController;
