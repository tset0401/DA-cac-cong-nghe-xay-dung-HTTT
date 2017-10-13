module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Account', {
        accountId: {
            type: DataTypes.UUID,
            allowNull: false, 
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: new Date()
        },
        role : {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    })
}