const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
    // For username
    username : {
    type : String,
    required : [true,'Username cannot be empty!']
    },

    // For Password
    password :{
        type : String,
        required : [true,'Password cannot be empty!']
    }
})

module.exports = mongoose.model('User',userSchema);
// module.exports = mongoose.model('User',userSchema);