module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Order', {
        orderId: {
            type: DataTypes.UUID,
            allowNull: false, 
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        customerId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: new Date()
        },
        address : {
            type: DataTypes.TEXT,
            allowNull: true
        },
        deliveryDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "Pending"
        }
    })
}