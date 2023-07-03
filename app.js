const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const dotenv = require('dotenv');
dotenv.config();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

const sequelize = require('./util/database');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseMembershipRoutes = require('./routes/purchaseMembership.js');
const leaderboardRoutes = require('./routes/leaderboard.js');
const passwordRoutes = require('./routes/resetPassword');
const reportRoutes = require('./routes/reports');


const Expense = require('./models/expense');
const User = require('./models/user');
const Order = require('./models/order');
const Password = require('./models/resetPassword');
const Download = require('./models/download');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));


app.use('/', userRoutes);
app.use('/user', userRoutes);
app.use('/homePage', expenseRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseMembershipRoutes);
app.use('/premium', leaderboardRoutes); //
app.use('/password', passwordRoutes); //
app.use('/reports', reportRoutes); //

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Password);
Password.belongsTo(User);

User.hasMany(Download);
Download.belongsTo(User);

sequelize
    .sync()
    .then((result) => {
        app.listen(process.env.PORT || 3000);
    }) 
    .catch(error => {
        console.log(error);
    });