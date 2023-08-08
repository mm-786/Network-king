const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));
const path = require('path');
const router = express.Router();

// app.use('/', router);

app.get('*', function(req, res){
  res.redirect('https://network-king.in');
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});


