"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { addToMyList } from "../controller/movieController";
const userController_1 = require("../controller/userController");
const movie_tvshowController_1 = require("../controller/movie&tvshowController");
const mylistController_1 = require("../controller/mylistController");
const router = express_1.default.Router();
//register login router
router.post("/registeruser", userController_1.registerUser);
router.post("/loginuser", userController_1.loginUser);
// add movie and tvshows in to the database
router.post("/addmovie", movie_tvshowController_1.addMovie);
router.delete("/deletemovie/:id", movie_tvshowController_1.removeMovie);
router.post("/addtvshow", movie_tvshowController_1.addTVShow);
// add movie and tv   shows to mylist
router.post("/addtomylist", mylistController_1.addToMyList);
router.delete("/removefrommylist/:id", mylistController_1.removeFromMyList);
router.get("/getallfrommylist", mylistController_1.getAllFromMyList);
exports.default = router;
