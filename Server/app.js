const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();
const app = express();

app.enable('trust proxy',1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: ['https://anypart.netlify.app','http://localhost:3000'] }));
app.use(morgan('dev'));
app.use(express.static('public'));

const UserRoute = require('./API/Routes/Users');
const CookieRoute = require('./API/Routes/Cookies');
const OrdersRoute = require('./API/Routes/Orders');
const PartsRoute = require('./API/Routes/Parts');
const NotificationRoute = require('./API/Routes/Notifications');
const CategoriesRoute = require('./API/Routes/Categories');
const GaragesRoute = require('./API/Routes/Garages');
const SSE = require('./API/Routes/sseRoute');

app.use('/users', UserRoute);
app.use('/categories', CategoriesRoute);
app.use('/parts', PartsRoute);
app.use('/orders', OrdersRoute);
app.use('/notifications', NotificationRoute);
app.use('/garages', GaragesRoute);
app.use('/sse',SSE.router);
app.use('/cookie', CookieRoute);

const uri = process.env.MONGO_CONN;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { console.log('mongo connected') });


module.exports = app;