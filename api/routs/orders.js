const express = require('express');
const mongoose = require('mongoose');


const Order = require('../models/order');
const Product = require('../models/product');


const Router = express.Router()

Router.get('/', (req, res, next) => {
    Order.find()
    .populate('product')
    .exec()
        .then(results => {
            res.status(200).json({
                results: results.length,
                order: results.map(result => {
                    return {
                        id : result._id,
                        product: result.product,
                        quantity: result.quantity,
                        request: {
                            type: "GET",
                            url: "http://localhost:3308/orders/" + result._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

Router.post('/', (req, res, next) => {
    Product.findById(req.body.product).exec()
        .then(product => {
            if (!product) {
                res.status(404).json({
                    message: "Product not found"
                })
            } else {
                const order = new Order({
                    _id: new mongoose.Types.ObjectId(),
                    product: req.body.product,
                    quantity: req.body.quantity
                })
                order.save()
                    .then(result => {
                        res.status(201).json({
                            message: "Order created succefully",
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3308/orders/' + result._id
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
                    })
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

Router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId).select('product quantity _id')
    .populate('product')
    .exec()
        .then(result => {
            if (!result) {
                res.status(404).json({
                    message: "Not found"
                })
            } else {
                res.status(200).json(result)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

Router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id).exec()
        .then(result => {
            if (!result) {
              res.status(404).json({
                  message : "This order doesn't exist"
              })
            } else {
                Order.remove({ _id: req.params.orderId }).exec()
                .then(result => {
                    res.status(200).json({
                        message: "Order deleted",
                    })

                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
            } 
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                error : err
            })
        })

})

module.exports = Router