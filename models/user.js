import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// This plugin will add username, hash and salt fields to store the username, the hashed password and the salt value. It also adds some methods to our model.
userSchema.plugin(passportLocalMongoose.default);

const User = mongoose.model("User", userSchema);

export default User;
