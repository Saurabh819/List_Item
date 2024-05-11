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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFromMyList = exports.removeFromMyList = exports.addToMyList = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const mylist_1 = require("../model/mylist"); // Assuming MyListModel and MyListDocument are exported from a separate file
const movie_1 = require("../model/movie");
const tvshow_1 = require("../model/tvshow");
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default();
const cache = new node_cache_1.default({ stdTTL: 60 });
const addToMyList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, title, description, genres, releaseDate, director, actors, episodes, } = req.body;
        // Validate request body
        if (!type || !title || !description || !genres || !releaseDate) {
            res
                .status(400)
                .json({
                message: "Type, title, description, genres, and release date are required.",
            });
            return;
        }
        // Check if type is either 'movie' or 'tvShow'
        if (type !== "movie" && type !== "tvShow") {
            res
                .status(400)
                .json({ message: 'Type must be either "movie" or "tvShow".' });
            return;
        }
        // Check if the movie or TV show exists in the database
        if (type === "movie") {
            const existingMovie = yield movie_1.MovieModel.findOne({ title });
            if (!existingMovie) {
                res.status(404).json({ message: "Movie not found in the database." });
                return;
            }
        }
        else {
            const existingTVShow = yield tvshow_1.TVShowModel.findOne({ title });
            if (!existingTVShow) {
                res.status(404).json({ message: "TV show not found in the database." });
                return;
            }
        }
        // Create a new MyList instance
        const newMedia = new mylist_1.MyListModel({
            type,
            title,
            description,
            genres,
            releaseDate,
            director,
            actors,
            episodes,
        });
        // Save media to the database
        const savedMedia = yield newMedia.save();
        res.status(201).json(savedMedia);
    }
    catch (error) {
        console.error("Error adding media to MyList:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addToMyList = addToMyList;
const removeFromMyList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate ID
        if (!id) {
            res.status(400).json({ message: "ID is required." });
            return;
        }
        // Find media by ID and remove it
        const deletedMedia = yield mylist_1.MyListModel.findByIdAndDelete(id);
        if (!deletedMedia) {
            res.status(404).json({ message: "Media not found in the list." });
            return;
        }
        res
            .status(200)
            .json({ message: "Media removed successfully", deletedMedia });
    }
    catch (error) {
        console.error("Error removing media from MyList:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.removeFromMyList = removeFromMyList;
// export const getAllFromMyList = async (req: Request, res: Response): Promise<void> => {
//   try {
//       const { page = 1, limit = 10 } = req.query;
//       // Convert page and limit to numbers
//       const pageNumber = parseInt(page as string, 10);
//       const limitNumber = parseInt(limit as string, 10);
//       // Validate page and limit values
//       if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
//           res.status(400).json({ message: 'Invalid page or limit value.' });
//           return;
//       }
//       // Calculate skip value for pagination
//       const skip = (pageNumber - 1) * limitNumber;
//       // Retrieve MyList items with pagination and limiting fields
//       const myListItems = await MyListModel.find({})
//           .select('type title description genres releaseDate -_id') // Limiting fields
//           .skip(skip)
//           .limit(limitNumber);
//       res.status(200).json(myListItems);
//   } catch (error) {
//       console.error('Error fetching MyList items:', error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// };
const getAllFromMyList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10 } = req.query;
        // Convert page and limit to numbers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        // Validate page and limit values
        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            res.status(400).json({ message: 'Invalid page or limit value.' });
            return;
        }
        // Check if the data exists in the cache
        const cacheKey = `myList_${pageNumber}_${limitNumber}`;
        const cachedData = yield redis.get(cacheKey);
        if (cachedData) {
            // If data exists in the cache, return it
            res.status(200).json(JSON.parse(cachedData));
        }
        else {
            // If data is not in the cache, fetch it from the database
            const skip = (pageNumber - 1) * limitNumber;
            const myListItems = yield mylist_1.MyListModel.find({})
                .select('type title description genres releaseDate -_id') // Limiting fields
                .skip(skip)
                .limit(limitNumber);
            // Cache the fetched data
            yield redis.set(cacheKey, JSON.stringify(myListItems), 'EX', 10); // Cache for 10 seconds
            res.status(200).json(myListItems);
        }
    }
    catch (error) {
        console.error('Error fetching MyList items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllFromMyList = getAllFromMyList;
