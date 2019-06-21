const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// @desc hashes password on the instance of User model
UserSchema.methods.hashMe = async function() {
    //Only when instance is created allow hashing a password
    if(this.isNew) {
        const salt = await bcrypt.genSalt(12);
        //Save hashed password
        this.password = await bcrypt.hash(this.password, salt);
    }
}
UserSchema.methods.returnJwtPayload = async function() {
    return {
        user: {
            id: this._id
        }
    }
}

module.exports = mongoose.model('users', UserSchema);