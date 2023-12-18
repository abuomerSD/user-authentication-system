const { Sequelize, DataTypes, Model } = require('sequelize');

const dbURI = "postgres://asdf:''@localhost:5432/auth";
const sequelize = new Sequelize(dbURI);

class User extends Model {}

function init(){
    createUserTable();
}

init();

User.init({
    username:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

async function createUserTable(){
    
}

