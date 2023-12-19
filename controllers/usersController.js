const { Sequelize, DataTypes, Model, where } = require('sequelize');
const bcrypt = require('bcrypt');

const dbURI = "postgres://asdf:''@localhost:5432/auth";
const sequelize = new Sequelize(dbURI);

class User extends Model {}



User.init({
    username:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    sequelize,
    modelName: 'User',
    timestamps: false,
})

function init(){
    // createUserTable();
    // testDb();
}

init();

async function createUserTable(){
    await User.sync({force: true});
}

async function testDb(){
    await sequelize.authenticate();
    console.log('connected');
    // const users = await User.findAll();
    // console.log(users);
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.json(error);
    }
}

const createUser = async (req, res) => {
    let user = {}

    try
    {
        user.username = req.body.username;
        const salt = await bcrypt.genSalt();
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await User.create(user);
        res.json(user);
    }catch(err){
        res.json(err);
    }
}

const updateUser = async (req, res) => {
    
    try {
        // let user = await User.findOne({
        //     where: {
        //         id: req.params.id,
        //     }
        // })
        // console.log(user);
        let user = {}
        user.username = req.body.username;
        const salt = await bcrypt.genSalt();
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await User.update({user}, {
            where: {
                id: req.params.id,
            }
        });
        res.json(user);

    } catch (error) {
        res.json(error);
    }
}


module.exports = {
    getAllUsers,
    createUser,
    updateUser,
}
