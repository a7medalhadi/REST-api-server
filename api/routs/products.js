const express = require('express');
const Product = require('../models/product');
const checkAuth = require('../middle/check-auth')
const mongoose = require('mongoose')
const multer = require('multer')

const storage = multer.diskStorage({
    destination :  (req , file , cb)=>{
        cb(null , './uploads/');
    },
    filename : (req , file ,cb)=>{
        cb(null , file.originalname )
    }
    
})

const fileFilter = (req , file , cb)=>{
    if (file.mimetype ==='image/jpg' || file.mimetype ==='image/jpeg' || file.mimetype === 'image/png' ){
        cb(null , true)
    } else {
        cb(null , false)
    }
}

const upload = multer({
     storage : storage ,
     fileFilter : fileFilter
    })

const Router = express.Router();

//Post new product 
Router.post('/',checkAuth, upload.single('productImg') , (req , res , next)=>{
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price ,
        productImg : req.file.path 
    })
    product.save()
    .then(result =>{
         console.log(res)  
        res.status(200).json({
            message : 'Handling post requist to /product',
            result : result
    })
    })
    .catch(err=>{
        res.status(500).json({
            error : err
        })
        console.log(err)})

});

//Get all products
Router.get('/',(req , res , next)=>{
    Product.find().exec().then(result=>{
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
})

//Get a product by Id
Router.get('/:productId',(req , res , next)=>{
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc =>{
        console.log(res)
        res.status(200).json(doc)
    })
    .catch(err=>{
        res.status(500).json({
            error : err
        })
        console.log(err)})
})

//delete product by Id
Router.delete('/:productId',(req , res , next)=>{
    const id = req.params.productId ;
    Product.remove({ _id : id })
    .exec()
    .then(result=> res.status(200).json({
        result : result
    }) )
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    })

})

// patch update product
Router.patch('/:productId',(req , res , next)=>{
    const id = req.params.productId;
    const updateOps = {}
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id : id } , { $set : updateOps })
    .exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
})

module.exports = Router