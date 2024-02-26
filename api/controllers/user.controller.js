import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({
        message: 'Api route is working',
    });
};

export const updateUser = async (req, res, next) => { 
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account!"));
    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            // use the set method to update the user data (bcs user maybe wouldnt update all data, maybe just want update eg. email)
            // the set method will only update the data that is provided
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, {new: true});
        // new: true is used to return the updated user data

        const {password, ...rest} = updateUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};