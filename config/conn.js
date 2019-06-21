const mongoose = require('mongoose');
const config = require('config');

const connectMongo = async (callback) => {
    try{ 
        await mongoose.connect(config.get('mongoURI'), {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
        callback();
    } catch(err) {
        callback(err);
    }
};

module.exports = connectMongo;