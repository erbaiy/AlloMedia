const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./app/config/corsOptions');
const { logger } = require('./app/middleware/logEvents');
const errorHandler = require('./app/middleware/errorHandler');
const verifyJWT = require('./app/middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./app/middleware/credentials');
const connectDB=require('./db/dbconnect')
const PORT = process.env.PORT || 3500;



// Connect to MongoDB
connectDB();
// custom middleware logger
app.use(logger);


// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files

// routes
app.use('/register', require('./app/routes/register'));
app.use('/auth', require('./app/routes/auth'));
app.use('/refresh', require('./app/routes/refresh'));
app.use('/logout', require('./app/routes/logout'));
app.get('/',(req,res)=>{
    res.send('welcome');
})

app.use(verifyJWT);
app.get('/home', (req, res) => {
    res.send('Home page');
}); 

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));