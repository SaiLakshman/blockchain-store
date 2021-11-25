const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const log4js = require('log4js');
const logger = log4js.getLogger('bc-app-log');
const serverConfig = require("./configs/server_config.json");
require('dotenv').config();



log4js.configure({
    appenders: { BC: { type: 'dateFile', filename: 'bcapis-log.log', pattern: '.yyyy-MM-dd', compress: true } },
    categories: { default: { appenders: ['BC'], level: 'debug' } }
});

const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/service'


mongoose.connect(url ,{useNewUrlParser:true})

const con = mongoose.connection
mongoose.set('debug', true);


con.on('open',() => {

    console.log('connected to mongodb....')
})

// We are using our packages here

app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true})); 

app.options('*', cors());
app.use(cors())

//You can use this to check if your server is working


app.get('/', (req, res)=>{
res.send("Application running at Port "+serverConfig.port)
})


//importing models
require('./model/message');
require('./model/User');


//importing passport for authentication of login 
require('./configs/passport');


var client = require('./Routes/client');
app.use('/client', client);


var users = require('./Routes/users');
app.use('/user', users);


const script = require("./Routes/newScript");
app.use("/script", script);

//Start your server on a specified port

app.listen(serverConfig.port, function (req, res) {
    console.log("node started at "  + serverConfig.port)
});





