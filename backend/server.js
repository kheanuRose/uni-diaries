//imports
let app = require('./app');
let dotenv = require('dotenv');
let mongoose = require('mongoose');

//dotenv configuration
dotenv.config({path: './config.env'});

//port and local connection string assignment
let port = process.env.PORT 
let local_connection_string = process.env.LOCAL_CONNECTION_STRING;


//database connection
mongoose.connect(local_connection_string, {useNewUrlParser: true})
.then((con)=>{
    console.log("Connected to database");
})
.catch((error)=>{
    console.log(`error connecting to database ${error}`);
})


//server connection
app.listen(port, ()=>{
    console.log('server is running')
    console.log(`Server is running on port ${port}`);
})
