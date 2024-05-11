import mongoose, { Schema, Document } from 'mongoose';

type Genre = 'Action' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Romance' | 'SciFi';

// Define interface representing TV show document
interface TVShowDocument extends Document {
  title: string;
  description: string;
  genres: Genre[];
  episodes: Array<{
    episodeNumber: number;
    seasonNumber: number;
    releaseDate: Date;
    director: string;
    actors: string[];
  }>;
}

// Define TV show schema
const TVShowSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: [{ type: String, enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'], required: true }],
  episodes: [{
    episodeNumber: { type: Number, required: true },
    seasonNumber: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    actors: [{ type: String, required: true }],
  }],
});

// Define and export TVShow model based on schema
const TVShowModel = mongoose.model<TVShowDocument>('TVShow', TVShowSchema);
export {TVShowModel,TVShowDocument}