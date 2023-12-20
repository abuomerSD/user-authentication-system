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
        if(users.length < 1) {
            return res.json({message: 'No users'});
        }
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
        // let user = {}
        // console.log(`id: ${req.params.id}`)
        // user.username = req.body.username;
        // const salt = await bcrypt.genSalt();
        // const password = req.body.password;
        // const hashedPassword = await bcrypt.hash(password, salt);
        // user.password = hashedPassword;
        // const updateUser = await User.update({user}, {
        //     where: {
        //         id: req.params.id,
        //     }
        // })
        //     .then(res.json(updateUser));

        const {username, password} = req.body;
        const user = await User.findOne({
            where: {
                id: req.params.id,
            }
        });
        user.username = username;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password , salt);
        user.password = hashedPassword;

        user.save({fields:['username', 'password']});
        res.json(user);

        

    } catch (error) {
        res.json(error);
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id,
            }
        });
        await User.destroy({
            where: {
                id: req.params.id,
            }
        });
        res.json({message: `${user.username} has been deleted`});
    } catch (error) {
        res.json(error);
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({
            message: 'username or password not provided',
        });
    }

    try {
        const user = await User.findOne({
            where: {
                id: req.params.id,
            }
        })
    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
          })
    }
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
}
