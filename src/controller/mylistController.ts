import { Request, Response } from "express";
import NodeCache from 'node-cache';
import { MyListModel, MyListDocument } from "../model/mylist"; // Assuming MyListModel and MyListDocument are exported from a separate file
import { MovieModel, Movie } from "../model/movie";
import { TVShowModel, TVShowDocument } from "../model/tvshow";
import Redis from 'ioredis';

const redis = new Redis();

const cache = new NodeCache({ stdTTL: 60 });

 export const addToMyList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      type,
      title,
      description,
      genres,
      releaseDate,
      director,
      actors,
      episodes,
    } = req.body;

    // Validate request body
    if (!type || !title || !description || !genres || !releaseDate) {
      res
        .status(400)
        .json({
          message:
            "Type, title, description, genres, and release date are required.",
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
      const existingMovie = await MovieModel.findOne({ title });
      if (!existingMovie) {
        res.status(404).json({ message: "Movie not found in the database." });
        return;
      }
    } else {
      const existingTVShow = await TVShowModel.findOne({ title });
      if (!existingTVShow) {
        res.status(404).json({ message: "TV show not found in the database." });
        return;
      }
    }

    // Create a new MyList instance
    const newMedia: MyListDocument = new MyListModel({
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
    const savedMedia = await newMedia.save();

    res.status(201).json(savedMedia);
  } catch (error) {
    console.error("Error adding media to MyList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFromMyList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      res.status(400).json({ message: "ID is required." });
      return;
    }

    // Find media by ID and remove it
    const deletedMedia = await MyListModel.findByIdAndDelete(id);

    if (!deletedMedia) {
      res.status(404).json({ message: "Media not found in the list." });
      return;
    }

    res
      .status(200)
      .json({ message: "Media removed successfully", deletedMedia });
  } catch (error) {
    console.error("Error removing media from MyList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


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



export const getAllFromMyList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    // Validate page and limit values
    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      res.status(400).json({ message: 'Invalid page or limit value.' });
      return;
    }

    // Check if the data exists in the cache
    const cacheKey = `myList_${pageNumber}_${limitNumber}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      // If data exists in the cache, return it
      res.status(200).json(JSON.parse(cachedData));
    } else {
      // If data is not in the cache, fetch it from the database
      const skip = (pageNumber - 1) * limitNumber;
      const myListItems = await MyListModel.find({})
        .select('type title description genres releaseDate -_id') // Limiting fields
        .skip(skip)
        .limit(limitNumber);

      // Cache the fetched data
      await redis.set(cacheKey, JSON.stringify(myListItems), 'EX', 10); // Cache for 10 seconds

      res.status(200).json(myListItems);
    }
  } catch (error) {
    console.error('Error fetching MyList items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};