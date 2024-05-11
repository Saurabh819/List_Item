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
exports.addTVShow = exports.removeMovie = exports.addMovie = void 0;
const movie_1 = require("../model/movie"); // Assuming MovieModel and Movie are exported from a separate file
const tvshow_1 = require("../model/tvshow"); // Assuming TVShowModel and TVShow are exported from a separate file
const mongoose_1 = __importDefault(require("mongoose"));
const addMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, genres, releaseDate, director, actors } = req.body;
        // Validate request body
        if (!title ||
            !description ||
            !genres ||
            !releaseDate ||
            !director ||
            !actors) {
            res
                .status(400)
                .json({
                message: "Title, description, genres, release date, director, and actors are required.",
            });
            return;
        }
        // Create a new movie instance
        const newMovie = new movie_1.MovieModel({
            title,
            description,
            genres,
            releaseDate,
            director,
            actors,
        });
        // Save movie to database
        const savedMovie = yield newMovie.save();
        res.status(201).json({
            success: true,
            message: "Movie Added successfully",
            data: savedMovie,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error,
            data: null,
        });
    }
});
exports.addMovie = addMovie;
const removeMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate movie ID
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid movie ID' });
            return;
        }
        // Find movie by ID and remove it
        const deletedMovie = yield movie_1.MovieModel.findOneAndDelete({ _id: id });
        if (!deletedMovie) {
            res.status(404).json({ message: 'Movie not found' });
            return;
        }
        res.status(200).json({ message: 'Movie deleted successfully', deletedMovie });
    }
    catch (error) {
        console.error('Error removing movie:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.removeMovie = removeMovie;
const addTVShow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, genres, episodes } = req.body;
        // Validate request body
        if (!title || !description || !genres || !episodes || !Array.isArray(episodes) || episodes.length === 0) {
            res.status(400).json({ message: 'Title, description, genres, and at least one episode are required.' });
            return;
        }
        // Create a new TV show instance
        const newTVShow = new tvshow_1.TVShowModel({
            title,
            description,
            genres,
            episodes
        });
        // Save TV show to database
        const savedTVShow = yield newTVShow.save();
        res.status(201).json({
            success: true,
            message: "TVShow Added successfully",
            data: savedTVShow,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error,
            data: null,
        });
    }
});
exports.addTVShow = addTVShow;
