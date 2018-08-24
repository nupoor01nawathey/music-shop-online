const mongoose               = require('mongoose'),
      Schema                 = mongoose.Schema,
      PassportLocalMongoose  = require('passport-local-mongoose');


const userSchema = new Schema({
    email:    {type: String, unique: true, required: true},
    password: {type: String, required: true}
});

userSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
