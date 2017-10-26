var nv = require('node-validator');
var rule = require('./validate/user-validator');

var SupplierService = function (supplierRepository) {
    this.supplierRepository = supplierRepository;
}
SupplierService.prototype.getOne = function (condition, select, callback) {
    condition.isDelete = false;
    condition.isActive = true;

    this.supplierRepository.findOneBy(condition, select, function (err, result) {
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

SupplierService.prototype.getMany = function (condition, orderBy, select, page, limit, callback) {
    condition.isDelete = false;
    condition.isActive = true;

    this.supplierRepository.findAllBy(condition, null, orderBy, select, page, limit, function (err, result) {
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

SupplierService.prototype.create = function (supplierProps, callback) {
    var self = this;
    //validate props
    var val = await validate(rule.checkSupplier, supplierProps);
    if (val.numErr > 0){
        return callback({type: "Bad Request", error: val.error});
    }

    self.supplierRepository.findOneBy({
        'accountId': supplierProps.accountId
    }, [], null, function (err, user) {
        if (err) {
            next(err);
        }
        if (!user) {
            self.supplierRepository.create(supplierProps, null, function (err, newSupplier) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, newSupplier);
                }
            })
        } else {
            callback({
                type: "Duplicated"
            });
        }
    })
}

SupplierService.prototype.update = function (supplierProps, callback) {
    var self = this;
    //validate props
    var val = await validate(rule.checkSupplier, supplierProps);
    if (val.numErr > 0){
        return callback({type: "Bad Request", error: val.error});
    }


    self.supplierRepository.findeOneBy({
        supplierId: supplierProps.supplierId
    }, [], null, function (err, supplierObj) {
        if (err) {
            callback(err);
        } else if (supplierObj) {
            supplierObj = Object.assign({},
                supplierObj,
                supplierProps
            );
            repository.update(supplierObj, null, function (err, result) {
                if (err) {
                    callback(err);
                } else if (result) {
                    callback(null, supplierObj)
                }
            })
        } else {
            callback({
                type: 'Not Found'
            });
        }
    })
}

SupplierService.prototype.delete = async function (supplierProps, callback) {
    var val = await validate(rule.checkSupplier, supplierProps);
    if (val.numErr > 0) {
        return callback({
            type: "Bad Request",
            error: val.error
        });
    }

    var condition = {
        supplierId: supplierProps.supplierId,
        isActive: true,
        isDelete: false
    }
    
    this.supplierRepository.findOneBy(condition, [], null, function (err, supplierObj) {
        if (err) {
            return callback(err);
        } else if (supplierObj) {
            supplierProps.isDelete = true;
            supplierObj = Object.assign({}, supplierObj, supplierProps);
            
            this.supplierRepository.update(supplierObj, null, function (err, result) {
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

function validate(rule, obj){
    return new Promise(function(resole){
        nv.run(rule, obj, function(numErr, err){
            if (numErr){
                console.error(err);
                resole({numErr: numErr, error: err});
            }
        });
    })
}
module.exports = SupplierService;