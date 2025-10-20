const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');

const app = express();
// Use port from environment variables for deployment, or 3001 for local dev
const PORT = process.env.PORT || 3001; 

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('API server is running.');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running and listening on port ${PORT}`);
  });
}

module.exports = app;