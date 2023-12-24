const { Sequelize, DataTypes, Model, where } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const jwtSecret = process.env.JWT_SECRET ;

const dbURI = "postgres://asdf:''@localhost:5432/auth";
const sequelize = new Sequelize(dbURI);

class User extends Model {}



User.init({
    username:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // role: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    // }
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

const login = async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({
            message: 'username or password not provided',
        });
    }

    try {
        const user = await User.findOne({
            where: {
                username
            }
        });

        if(!user) {
            return res.status(400).json({
                message: 'user not found',
            });
        }

        bcrypt.compare(password, user.password)
            .then( (result) => {
                if(result){
                    // res.json({
                    //     message: 'login successfully',
                    // })
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        {id: user.id, username, role: user.role},
                        jwtSecret,
                        {
                        expiresIn: maxAge,
                        }
                    );

                    res.cookie('jwt', token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000,
                    });

                    res.json({
                        message: 'user logged in successfully',
                    })
                }
                else {
                    res.json({
                        message: 'password not match',
                    })
                }
            } )
    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
          })
    }
}

const register = async (req, res) => {
    
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).json({
            message: 'please enter the username and the password'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        username,
        password: hashedPassword,
    })
        .then((user)=> {
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
                {id: user.id, username, role:user.role},
                jwtSecret,
                {
                    expiresIn: maxAge, // 3 hrs in sec
                }
            )
            res.cookie('jwt', token,{
                httpOnly: true,
                maxAge: maxAge * 1000, // 3 hrs in ms
            })
            res.status(201).json({
                message: 'user added successfully',
            })
        })
        .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        }))

}

const getAdmin = (req, res) => {
    console.log('admin');
}

const getBasicUser = (req, res) => {
    console.log('basic user');
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    login,
    register,
    getAdmin,
    getBasicUser,
}
