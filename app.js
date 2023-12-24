const express = require('express');
require('dotenv').config();
const userRoute = require('./routes/userRoutes');
const { urlLogger } = require('./middleware/log');
const cookieParser = require('cookie-parser');
const { adminAuth, userAuth } = require('./middleware/auth');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(urlLogger);

app.use(cookieParser);

app.use('/users', userRoute);

app.listen(port, () => {
    console.log(`Server is Listening to requests at port: ${port}`);
});
