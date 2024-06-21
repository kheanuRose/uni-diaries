let express = require('express');
let path = require('path');
let app = express();
let cors = require('cors');
//let bodyParser = require('body-parser');

app.use(express.json());
// Middleware to serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
  };
  
app.use(cors(corsOptions));

let user_router = require('./routes/user_route');
app.use('/users', user_router);


module.exports = app;