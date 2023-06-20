const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const sequelize = require('./util/database');
const errorController = require('./controllers/error');
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const expenseRoutes = require('./routes/expense');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'root.html'));
});
app.use('/login', loginRoutes);
app.use('/signup', signupRoutes);
app.use('/expense', expenseRoutes);
app.use(errorController.get404);


// Start the server
sequelize
    .sync()
    .then(res => {
        app.listen(3000);
    }) 
    .catch(error => {
        console.error('Unable to sync database:', error);
    });