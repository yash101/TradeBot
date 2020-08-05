const axios = require('axios');

// this script requests training data and creates a database

// base dir for the database
const database_dir = '../database';

// symbol directory: db_dir/symb
const getSymbolDirectory = function(symbol) {
    return database_dir + '/' + symbol;
};