var nv = require('node-validator');
var rule = require('./validate/product-validator');

var ProductService = function (productRepository) {
    this.productRepository = productRepository;
}

ProductService.prototype.fulltextSearch = function (keywords, select, page, limit, callback) {
    
    this.productRepository.fulltextSearch(keywords, [], select, page, limit, function (err, result) {
        if (err) {
            return callback(err);
        } else if (result) {
            return callback(null, result);
        } else {
            return callback({
                type: "Not Found"
            });
        }
    })
}

ProductService.prototype.getOne = function (condition, select, callback) {
    condition.isDelete = false;
    condition.isActive = true;

    this.productRepository.findOneBy(condition, select, [], function (err, result) {
        if (err) {
            return callback(err);
        } else if (result) {
            delete result.isDelete;
            delete result.isActive;
            return callback(null, result);
        } else {
            return callback({
                type: "Not Found"
            });
        }
    })
}

ProductService.prototype.getMany = function (condition, orderBy, select, page, limit, callback) {
    condition.isDelete = false;
    condition.isActive = true;

    if (condition.minPrice | condition.maxPrice){
        condition['price'] = Object.assign({}, condition['price'], {
                $gte: condition.minPrice,
                $lte: condition.maxPrice
        });
        delete condition.minPrice;
        delete condition.maxPrice;
    }

    this.productRepository.findAllBy(condition, null, orderBy, select, page, limit, function (err, result) {
        if (err) {
            return callback(err);
        } else if (result) {
            for(i in result) {
                delete result[i].isDelete;
                delete result[i].isActive;
            }
            return callback(null, result);
        } else {
            return callback({
                type: "Not Found"
            });
        }
    })
}

ProductService.prototype.create = async function (productProps, callback) {
    var val = await validate(rule, productProps);
    if (val.numErr > 0) {
        return callback({
            type: "Bad Request",
            error: val.error
        });
    }

    this.productRepository.save(productProps, null, function (err, result) {
        if (err) {
            return callback(err);
        } else if (result) {
            delete result.isDelete;
            delete result.isActive;
            result.setCategories()
            return callback(null, result);
        } else {
            return callback({
                type: "Bad Request"
            });
        }
    });
}

ProductService.prototype.update = async function (productProps, callback) {
    var val = await validate(rule, productProps);
    if (val.numErr > 0) {
        return callback({
            type: "Bad Request",
            error: val.error
        });
    }

    var condition = {
        productId: productProps.productId,
        isActive: true,
        isDelete: false
    }
    this.productRepository.findOneBy(condition, [], null, function (err, productObj) {
        if (err) {
            return callback(err);
        } else if (productObj) {
            productObj = Object.assign({}, productObj, productProps);
            
            this.productRepository.update(productObj, null, function (err, result) {
                if (err) {
                    return callback(err);
                } else if (result) {
                    return callback(null, productObj);
                } else {
                    return callback({
                        type: 'Bad Request'
                    });
                }
            })
        } else {
            return callback({
                type: 'Not Found'
            });
        }
    })

}

ProductService.prototype.delete = async function (productProps, callback) {
    var val = await validate(rule, productProps);
    if (val.numErr > 0) {
        return callback({
            type: "Bad Request",
            error: val.error
        });
    }

    var condition = {
        productId: productProps.productId,
        isActive: true,
        isDelete: false
    }
    
    this.productRepository.findOneBy(condition, [], null, function (err, productObj) {
        if (err) {
            return callback(err);
        } else if (productObj) {
            productProps.isDelete = true;
            productObj = Object.assign({}, productObj, productProps);
            
            this.productRepository.update(productObj, null, function (err, result) {
                if (err) {
                    return callback(err);
                } else if (result) {
                    return callback({type: "Deleted"});
                } else {
                    return callback({
                        type: 'Bad Request'
                    });
                }
            })
        } else {
            return callback({
                type: 'Not Found'
            });
        }
    })

}

function validate(rule, obj) {
    return new Promise(function (resolve, reject) {
        nv.run(rule, obj, function (numErr, err) {
            if (numErr) {
                console.error(err);
                return resolve({
                    numErr: numErr,
                    error: err
                });
            } else {
                return resolve({
                    numErr: 0
                })
            }
        });
    })
}
module.exports = ProductService;