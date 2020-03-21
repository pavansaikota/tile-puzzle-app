const express = require('express');
const app = express();
const port = 3000;

app.use('/tile-app',express.static('src'));
app.listen(port,()=>console.log(`listening on port ${port}`) );