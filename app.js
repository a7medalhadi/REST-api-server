const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRouts = require('./api/routs/products')
const orderRouts = require('./api/routs/orders')
const userRouts = require('./api/routs/users')

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(morgan('dev'))

//db connection
mongoose.connect('mongodb+srv://route:9876543210@cluster0-mabyj.mongodb.net/test?retryWrites=true',{
    useNewUrlParser: true
})

//Handling CORS
app.use((req , res , next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if(req.method === "OPTIONS"){
        res.header('Access-Control-Allow-Methods'," PUT , GET , POST , DELETE , PATCH ")
        return res.status(200).json({})
    }
    next()
})

//Routing
app.use('/uploads' , express.static('uploads'))
app.use('/products' , productRouts );
app.use('/orders' , orderRouts );
app.use('/users' , userRouts );

//Handling errors
app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status=404;
    next(error)
})
app.use((error , req , res , next)=>{
    res.status(error.status||500).json({
        error : {
            message : error.message
        }
    })
})

module.exports = app ;