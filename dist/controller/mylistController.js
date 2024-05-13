"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFromMyList = exports.removeFromMyList = exports.addToMyList = void 0;
const mylist_1 = require("../model/mylist");
const movie_1 = require("../model/movie");
const tvshow_1 = require("../model/tvshow");
const ioredis_1 = require("ioredis"); // Ensure Redis import is available
// Assuming you have Redis properly configured and connected
const redis = new ioredis_1.Redis();
// Controller function to add a movie or TV show to mylist
const addToMyList = function addToMyList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, mediaId, mediaType } = req.body;
        // Validate request body
        if (!userId || !mediaId || !mediaType) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        try {
            // Check if media type is either 'movie' or 'tvshow'
            if (mediaType !== 'movie' && mediaType !== 'tvshow') {
                return res.status(400).json({ error: 'Invalid media type' });
            }
            // Check if the media ID exists in the respective collection
            let media;
            if (mediaType === 'movie') {
                media = yield movie_1.MovieModel.findById(mediaId);
            }
            else {
                media = yield tvshow_1.TVShowModel.findById(mediaId);
            }
            if (!media) {
                return res.status(404).json({ error: 'Media not found' });
            }
            // Check if the media is already in the user's list
            const existingMedia = yield mylist_1.MyListModel.findOne({ userId, mediaId, mediaType });
            if (existingMedia) {
                return res.status(400).json({ error: 'Media already exists in the list' });
            }
            // Add media to mylist
            // Construct success message with media information
            const mediaTitle = mediaType === 'movie' ? media.title : media.title; // Add appropriate property for title
            const successMessage = `${mediaType.toUpperCase()} '${mediaTitle}' added to mylist successfully`;
            yield mylist_1.MyListModel.create({ userId, mediaId, mediaType, mediaTitle });
            return res.status(201).json({ message: successMessage, media });
        }
        catch (error) {
            console.error('Error adding media to mylist:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
};
exports.addToMyList = addToMyList;
// Controller function to remove a movie or TV show from mylist
const removeFromMyList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mediaId } = req.params;
        // Validate request body
        // if (!mediaId) {
        //   return res.status(400).json({ error: 'Invalid request body' });
        // }
        // Check if the media exists in the user's list
        const removedMedia = yield mylist_1.MyListModel.findOneAndDelete({ mediaId });
        if (!removedMedia) {
            return res.status(404).json({ error: 'Media not found in the list' });
        }
        // Construct success message
        const successMessage = `Media removed from mylist successfully`;
        return res.status(200).json({ message: successMessage });
    }
    catch (error) {
        console.error('Error removing media from mylist:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.removeFromMyList = removeFromMyList;
// Controller function to get all items from mylist with pagination
const getAllFromMyList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10 } = req.query;
        // Convert page and limit to numbers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        // Validate page and limit values
        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({ message: 'Invalid page or limit value.' });
        }
        // Check if the data exists in the cache
        const cacheKey = `myList_${pageNumber}_${limitNumber}`;
        const cachedData = yield redis.get(cacheKey);
        if (cachedData) {
            // If data exists in the cache, return it
            const myListItems = JSON.parse(cachedData);
            return res.status(200).json(myListItems);
        }
        else {
            // If data is not in the cache, fetch it from the database
            const skip = (pageNumber - 1) * limitNumber;
            const myListItems = yield mylist_1.MyListModel.find({})
                .skip(skip)
                .limit(limitNumber);
            // Cache the fetched data
            yield redis.set(cacheKey, JSON.stringify(myListItems), 'EX', 10); // Cache for 10 seconds
            // Construct response object with complete media objects
            const response = yield Promise.all(myListItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                let media;
                if (item.mediaType === 'movie') {
                    media = yield movie_1.MovieModel.findById(item.mediaId);
                }
                else if (item.mediaType === 'tvshow') {
                    media = yield tvshow_1.TVShowModel.findById(item.mediaId);
                }
                if (media) {
                    return {
                        userId: item.userId,
                        mediaId: item.mediaId,
                        mediaType: item.mediaType,
                        media: media.toObject() // Convert Mongoose document to plain object
                    };
                }
                else {
                    // If media not found, return the original item
                    return item;
                }
            })));
            return res.status(200).json(response);
        }
    }
    catch (error) {
        console.error('Error fetching MyList items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllFromMyList = getAllFromMyList;
