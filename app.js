const express = require('express');
require('dotenv').config();
const userRoute = require('./routes/userRoutes');
const { urlLogger } = require('./middleware/log');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(urlLogger);

app.use('/users', userRoute);


app.listen(port, () => {
    console.log(`Server is Listening to requests at port: ${port}`);
});
