const express = require('express');
const app = express();

const {PORT} = require('./config/serverConfig');

const bodyParser = require('body-parser');

const setupAndStartServer = () =>{

    app.use(bodyParser);
    app.use(bodyParser.urlencoded({extended : true}));

    app.listen(PORT, ()=>{
        
        console.log(`Server started on ${PORT}`);
    });
}

setupAndStartServer();