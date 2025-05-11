const express = require('express');
const app = express();
const port = 3000;

const jpgToPdfRoute = require('./routes/jpgToPdfRoute');
const mergePdfRoute = require('./routes/mergePdfRoute');
const addPageNumbersRoute = require('./routes/addPageNumbersRoute');
const rotatePdfRoute = require('./routes/rotatePdfRoute');

const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(jpgToPdfRoute);
app.use(mergePdfRoute);
app.use(addPageNumbersRoute);
app.use(rotatePdfRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
