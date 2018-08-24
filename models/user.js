const mongoose               = require('mongoose'),
      Schema                 = mongoose.Schema,
      PassportLocalMongoose  = require('passport-local-mongoose');


const userSchema = new Schema({
    username: String,
    password: String
});

userSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
