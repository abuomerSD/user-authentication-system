const { Sequelize } = require('sequelize');

const dbURI = "postgres://asdf:''@localhost:5432/auth";
const sequelize = new Sequelize(dbURI);

async function testDbConnection()
{
        await sequelize.authenticate();
        console.log('connected Successfully');  
}

testDbConnection()
    .then(console.log('then'))
    .catch((err)=> console.log(err.message))

// sequelize.close();

