import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
    // get the signup data from the request body
    const { username, email, password } = req.body;
    // hash the password where the 10 is the salt number which is the number of round for creating the salt
    // Salt is the hash number that is added to the password to make it more secure
    // the 10 means the system will randomly generate 10 characters to add to the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // save the new user data to the database
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json("New user created successfully!");
    } catch (error)
    {
        res.status(500).json(error.message);
    }
    
};