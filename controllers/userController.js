const { Sequelize, Model, DataTypes } = require('sequelize');
const { Json } = require('sequelize/types/utils');

const dbURI = "postgres://asdf:''@localhost:5432/auth";
const sequelize = new Sequelize(dbURI);

async function testDbConnection()
{
        await sequelize.authenticate();
        console.log('connected Successfully');  
        checkUserModel();
        // createUserTable();
        // saveFirstUser();
        // saveSecondUser();
        getAllUsers();
}

testDbConnection()
    .then(console.log('then'))
    .catch((err)=> console.log(err.message))

// sequelize.close();


class User extends Model {}

User.init({
    firstName : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'User'
})

// the second method to create a model in sequelize is to use the define function

// const User = sequelize.define('User', {
//     firstName : {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     lastName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     }
// })

function checkUserModel() {
    console.log(User === sequelize.models.User);
}


// to synchronize one model
async function createUserTable(){
    await User.sync({alter: true});
    console.log('the user table has been recreated');
}

// to synchronize all models

async function createAllTables(){
    await sequelize.sync()
}

// create users with bulid() and save() methods

const eltayeb = User.build({
    firstName: 'Eltayeb',
    lastName: 'Ibrahim'
});

async function saveFirstUser(){
    await eltayeb.save();
    console.log('Eltayeb has been saved successfully to the database');
}

async function saveSecondUser(){
    const ahmed = await User.create({
        firstName: 'Ahmed',
        lastName: 'Ibrahim'
    });

    console.log('Ahmed has been saved successfully to the database');
}


async function getAllUsers(){
    // const users = await User.findAndCountAll();
    // console.log('count: ',users.count);
    // console.log(users.User);
    // users = null;
    const users = await User.findAll();
    console.log('users: ',users)
    console.log(users.every(user => console.log(user.firstName)));
    // console.log('all users: ', JSON.stringify(users));
}