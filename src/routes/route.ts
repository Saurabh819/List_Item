import express, { Router, Request, Response } from "express";
// import { addToMyList } from "../controller/movieController";
import { registerUser, loginUser } from "../controller/userController";
import { MovieModel, Movie } from "../model/movie";
import {
  addMovie,
  addTVShow,
  removeMovie,
} from "../controller/movie&tvshowController";
import {
  addToMyList,removeFromMyList,getAllFromMyList
} from "../controller/mylistController";

const router: Router = express.Router();

//register login router
router.post("/registeruser", registerUser);
router.post("/loginuser", loginUser);

// add movie and tvshows in to the database
router.post("/addmovie", addMovie);
router.delete("/deletemovie/:id", removeMovie);
router.post("/addtvshow", addTVShow);

// add movie and tv   shows to mylist
router.post("/addtomylist", addToMyList);
router.delete("/removefrommylist/:id",removeFromMyList );
router.get("/getallfrommylist",getAllFromMyList );

export default router;


