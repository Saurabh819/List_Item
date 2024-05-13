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
const mylistController_1 = require("../../controller/mylistController");
const mylist_1 = require("../../model/mylist");
const movie_1 = require("../../model/movie");
// Mocking MyListModel, MovieModel, and TVShowModel
jest.mock('../models/MyListModel');
jest.mock('../models/MovieModel');
jest.mock('../models/TVShowModel');
describe('addToMyList Controller', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {
                type: 'movie',
                title: 'Test Movie',
                description: 'Test Description',
                genres: ['Action', 'Adventure'],
                releaseDate: '2024-01-01',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should add a movie to MyList', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mocking findOne to return a truthy value
        movie_1.MovieModel.findOne.mockResolvedValue(true);
        yield (0, mylistController_1.addToMyList)(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalled();
        expect(mylist_1.MyListModel.prototype.save).toHaveBeenCalled();
    }));
    it('should handle missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
        delete req.body.title; // Simulate missing required field
        yield (0, mylistController_1.addToMyList)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Type, title, description, genres, and release date are required.',
        });
        expect(mylist_1.MyListModel.prototype.save).not.toHaveBeenCalled();
    }));
    // Add more test cases following the same pattern
});
