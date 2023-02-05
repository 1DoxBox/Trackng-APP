require ('dotenv/config');
const express = require("express"); 
const app = express(); 
const cors = require('cors');  
const bodyParser = require('body-parser')  
const port = 9200;
  
const corsOptions = {
    origin: '*',  
    credentials: true,
  };

app.use(cors(corsOptions));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
  
app.use(bodyParser.json()); 
app.set('trust proxy', 1)  
  

app.use('/api', require('./_api'));    


app.listen(port, () => {
    console.log("Starting at port " + port); 
});