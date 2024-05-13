import { Request, Response } from "express";
import { MovieModel, Movie } from "../model/movie"; 
import { TVShowModel,TVShowDocument } from '../model/tvshow'; 
import mongoose from "mongoose";

export const addMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, genres, releaseDate, director, actors } =
      req.body;

   
    if (
      !title ||
      !description ||
      !genres ||
      !releaseDate ||
      !director ||
      !actors
    ) {
      res
        .status(400)
        .json({
          message:
            "Title, description, genres, release date, director, and actors are required.",
        });
      return;
    }

   
    const newMovie: Movie = new MovieModel({
      title,
      description,
      genres,
      releaseDate,
      director,
      actors,
    });

  
    const savedMovie = await newMovie.save();

    res.status(201).json({
      success: true,
      message: "Movie Added successfully",
      data: savedMovie,
      
    });
  } catch (error) {
    console.log(error);
     res.status(500).json({
      success: false,
      message: error,
      data: null,
    });
  }
};

export const removeMovie = async (req: Request, res: Response): Promise<void> => {
  try {
      const { id } = req.params;

      // Validate movie ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
          res.status(400).json({ message: 'Invalid movie ID' });
          return;
      }

      // Find movie by ID and remove it
      const deletedMovie = await MovieModel.findOneAndDelete({ _id: id });

      if (!deletedMovie) {
          res.status(404).json({ message: 'Movie not found' });
          return;
      }

      res.status(200).json({ message: 'Movie deleted successfully', deletedMovie });
  } catch (error) {
      console.error('Error removing movie:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


export const addTVShow = async (req: Request, res: Response): Promise<void> => {
  try {
      const { title, description, genres, episodes } = req.body;

      // Validate request body
      if (!title || !description || !genres || !episodes || !Array.isArray(episodes) || episodes.length === 0) {
          res.status(400).json({ message: 'Title, description, genres, and at least one episode are required.' });
          return;
      }

      // Create a new TV show instance
      const newTVShow: TVShowDocument = new TVShowModel({
          title,
          description,
          genres,
          episodes
      });

      // Save TV show to database
      const savedTVShow = await newTVShow.save();

      res.status(201).json({
        success: true,
        message: "TVShow Added successfully",
        data: savedTVShow,
        
      });
    } catch (error) {
      console.log(error);
       res.status(500).json({
        success: false,
        message: error,
        data: null,
      });
    }
  };