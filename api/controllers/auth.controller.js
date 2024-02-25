import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    // get the signup data from the request body
    const { username, email, password } = req.body;
    // hash the password where the 10 is the salt number which is the number of round for creating the salt
    // Salt is the hash number that is added to the password to make it more secure
    // the 10 means the system will randomly generate 10 characters to add to the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // save the new user data to the database
    // create User collection in mongodb
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json("New user created successfully!");
    } catch (error)
    {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // first check the email in the database whether it exists or not
        // second check the password in the database whether it matches or not
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User Not Found!"));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Wrong Credentials!"));
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        // as user sign-in, jwt token will sent to the client as a cookie and contain all the info
        // we don't want to send the password to the client, so we destructure the password from the user
        const { password: pass, ...rest } = validUser._doc;
        res
            .cookie('access_token', token, {httpOnly: true})
            .status(200)
            .json(rest);
    } catch (error) {
        next(error);
    }
}