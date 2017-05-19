// Get Dependencies.
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

// Get DB Config.
const config = require('./server/config/database');

// Set Database
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

// Database on Connect.
mongoose.connection.on('connected', () => {
  console.log('Connected to Database ' + config.database);
});

// Database on Error.
mongoose.connection.on('error', (err) => {
  console.log('Database Connection Error ' + err);
});

// Get API Routes.
const users = require('./server/routes/users');

const app = express();

// CORS Middleware.
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Set API Routes
app.use('/users', users);

// Passport Middleware.
app.use(passport.initialize());
app.use(passport.session());

require('./server/config/passport')(passport);

// Index Route.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);

// Create Http server.
const server = http.createServer(app);

// Start Server
server.listen(port, () => {
  console.log('Server started on port ' + port);
});