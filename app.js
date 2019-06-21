const express = require('express');
const connectDb = require('./config/conn');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
require('./passport/passport')(passport);
//Get routers
const usersRouter = require('./routes/api/users');
const authRouter = require('./routes/api/auth');
const profileRouter = require('./routes/api/profile');
const postsRouter = require('./routes/api/posts');

const path = require('path');

app.disable('x-powered-by');

//Using body and json parsers
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(passport.initialize());

//Init routes
app.use('/api', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api/users', usersRouter);

app.use('/api/auth', authRouter);

app.use('/api/profile', profileRouter);

app.use('/api/posts', postsRouter);


if(process.env.NODE_ENV === 'production') {
    
    app.use(express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });

}


const PORT = process.env.PORT || 8000;

connectDb((err) => {
    if(err){
        console.log('Error with connecting to database.');
        console.error(err.message);
        //Stop the server
        return process.exit(1);
    }
    //If db connection is successful then start the server by listening to port 
    app.listen(PORT, () => {
        console.log('Connected to db.');
        console.log('Listening on port '+PORT);
    });
});

