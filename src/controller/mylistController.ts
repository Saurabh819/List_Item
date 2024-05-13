import { Request, Response } from 'express';
import { MyListModel } from '../model/mylist';
import { MovieModel } from '../model/movie';
import { TVShowModel } from '../model/tvshow';
import { Redis } from 'ioredis'; // Ensure Redis import is available

// Assuming you have Redis properly configured and connected
const redis = new Redis();
// Controller function to add a movie or TV show to mylist
export const addToMyList =  async function addToMyList(req: Request, res: Response) {
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
      media = await MovieModel.findById(mediaId);
    } else {
      media = await TVShowModel.findById(mediaId);
    }

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Check if the media is already in the user's list
    const existingMedia = await MyListModel.findOne({ userId, mediaId, mediaType });
    if (existingMedia) {
      return res.status(400).json({ error: 'Media already exists in the list' });
    }

    // Add media to mylist
    
    // Construct success message with media information
    const mediaTitle = mediaType === 'movie' ? (media as any).title : (media as any).title; // Add appropriate property for title
    const successMessage = `${mediaType.toUpperCase()} '${mediaTitle}' added to mylist successfully`;
    
    await MyListModel.create({ userId, mediaId,mediaType, mediaTitle });
    return res.status(201).json({ message: successMessage, media });

  } catch (error) {
    console.error('Error adding media to mylist:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Controller function to remove a movie or TV show from mylist

export const removeFromMyList = async (req: Request, res: Response) => {
  try {
    const { mediaId } = req.params;

    // Validate request body
    // if (!mediaId) {
    //   return res.status(400).json({ error: 'Invalid request body' });
    // }

    // Check if the media exists in the user's list
    const removedMedia = await MyListModel.findOneAndDelete({ mediaId });

    if (!removedMedia) {
      return res.status(404).json({ error: 'Media not found in the list' });
    }

    // Construct success message
    const successMessage = `Media removed from mylist successfully`;

    return res.status(200).json({ message: successMessage });

  } catch (error) {
    console.error('Error removing media from mylist:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// Controller function to get all items from mylist with pagination
export const getAllFromMyList = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    // Validate page and limit values
    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ message: 'Invalid page or limit value.' });
    }

    // Check if the data exists in the cache
    const cacheKey = `myList_${pageNumber}_${limitNumber}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      // If data exists in the cache, return it
      const myListItems = JSON.parse(cachedData);
      return res.status(200).json(myListItems);
    } else {
      // If data is not in the cache, fetch it from the database
      const skip = (pageNumber - 1) * limitNumber;
      const myListItems = await MyListModel.find({})
        .skip(skip)
        .limit(limitNumber);

      // Cache the fetched data
      await redis.set(cacheKey, JSON.stringify(myListItems), 'EX', 10); // Cache for 10 seconds

      // Construct response object with complete media objects
      const response = await Promise.all(myListItems.map(async (item: any) => {
        let media;
        if (item.mediaType === 'movie') {
          media = await MovieModel.findById(item.mediaId);
        } else if (item.mediaType === 'tvshow') {
          media = await TVShowModel.findById(item.mediaId);
        }

        if (media) {
          return {
            userId: item.userId,
            mediaId: item.mediaId,
            mediaType: item.mediaType,
            media: media.toObject() // Convert Mongoose document to plain object
          };
        } else {
          // If media not found, return the original item
          return item;
        }
      }));

      return res.status(200).json(response);
    }
  } catch (error) {
    console.error('Error fetching MyList items:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};