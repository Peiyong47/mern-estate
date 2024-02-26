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
};

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
            // if user exists, authenticate and sign in the user
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest);
  
        } else {
            // if user does not exist, create a new user
            // but in the user model, we set the password as required, so we need to generate a random password for the user
            // then the user can change the password later
            // the 36 means number from zero to nine & letters from A to Z
            // .slice(-8) means we want to get the last 8 characters from the generated password
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        // then again hash the generated password
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({ 
             // create a username by taking the display name from google oauth and remove the spaces and convert to lowercase
            // + add 4 random characters to make the username unique
            username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) , 
            email: req.body.email, 
            password: hashedPassword, 
            avatar: req.body.photo 
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
  
      }
    } catch (error) {
      next(error)
    }
};

export const signout = (req, res) => { 
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been signed out!');
    } catch (error) {

    }
};


