const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../config/.env') });

const app = express();

const PORT = process.env.PORT || 8002;

app.listen(PORT, () => {
  console.log(`server running at ${PORT} on ${process.env.NODE_ENV} mode`);
});
