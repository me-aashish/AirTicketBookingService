const express = require('express');
const app = express();

const {PORT} = require('./config/serverConfig');

const bodyParser = require('body-parser');

const apiRoutes = require('./routes/index');

const db = require('./models/index')

const setupAndStartServer = () =>{

    app.use(bodyParser);
    app.use(bodyParser.urlencoded({extended : true}));

    app.use('/api',apiRoutes);

    app.listen(PORT, ()=>{
        console.log(`Server started on ${PORT}`);

        if(process.env.DB_SYNC){
            db.sequelize.sync({alter : true});
        }
    });
}

setupAndStartServer();