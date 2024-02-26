import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,   
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://th.bing.com/th/id/OIP.dNfuZjZeZUmYxsqHRhYtSQHaHa?rs=1&pid=ImgDetMain"
    },
}, {timestamps: true});

// the ('User') is the name of the collection in the database (it will be created if it doesn't exist yet
// in MongoDB, the collection name need to be in uppercase and singular form
const User = mongoose.model('User', userSchema);

export default User;