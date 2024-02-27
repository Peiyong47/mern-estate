import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res) => {  
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error)
    }
};
export const deleteListing = async (req, res) => {  
    // first we need to find the listing
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, 'Listing not Found!'));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(403, 'You can only delete your own listings!'));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted!');
    } catch (error) {
        next(error);
    }
};

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {  
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    
    let offer = req.query.offer; // we want to get the offer from the query from the search
    // undefine is when we first search from the search bar, so the query wouldnt have offer query, so it will be undefined
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };// if the offer is undefined or false, we want to get all listings from the databse where offer is either false or true
    }

    let furnished = req.query.furnished; // we want to get the furnished from the query from the search
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };// if the furnished is undefined or false, we want to get all listings from the databse where furnished is either false or true
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };// if the parking is undefined or false, we want to get all listings from the databse where parking is either false or true
    }

    let type = req.query.type;
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt'; // want to sort listing based on createdAt (the timestamp it was created) if the sort option is not specified by user

    const order = req.query.order || 'desc'; // want to sort listing based on descending order if the order(sort option) is not specified by user

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' }, // the option: i means the search is case insensitive (wouldnt care about the uppercase or lowercase)
      offer, 
      furnished,
      parking,
      type,
    }).sort({
      [sort] : order // want to sort the listing based on the sort(createdAt) that is in descending order
    }).limit(limit).skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}