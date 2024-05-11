import mongoose, { Schema, Document } from 'mongoose';

// Define the possible genres
type Genre = 'Action' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Romance' | 'SciFi';

// Define interface representing the common properties of both movies and TV shows
interface MediaCommon {
    title: string;
    description: string;
    genres: Genre[];
}

// Define interface representing the MyList document
interface MyListDocument extends Document, MediaCommon {
    type: 'movie' | 'tvShow'; // Indicates whether it's a movie or TV show
    releaseDate: Date;
    director?: string; // This field is optional for TV shows
    actors?: string[]; // This field is optional for TV shows
    episodes?: Array<{
        episodeNumber: number;
        seasonNumber: number;
        releaseDate: Date;
        director: string;
        actors: string[];
    }>;
}

// Define MyList schema
const MyListSchema: Schema = new Schema({
    type: { type: String, enum: ['movie', 'tvShow'], required: true }, // Indicate whether it's a movie or TV show
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: [{ type: String, enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'], required: true }],
    releaseDate: { type: Date, required: true },
    director: { type: String }, // This field is optional for TV shows
    actors: [{ type: String }], // This field is optional for TV shows
    episodes: [{
        episodeNumber: { type: Number, required: true },
        seasonNumber: { type: Number, required: true },
        releaseDate: { type: Date, required: true },
        director: { type: String, required: true },
        actors: [{ type: String, required: true }],
    }],
});

MyListSchema.index({ type: 1 }); // Index for type field
MyListSchema.index({ genres: 1 }); // Index for genres field
MyListSchema.index({ releaseDate: -1 }); // Index for releaseDate field (descending order)
MyListSchema.index({ title: 'text', description: 'text' }); // Text index for title and description fields

// Define and export MyList model based on schema
const MyListModel = mongoose.model<MyListDocument>('MyList', MyListSchema);
export { MyListDocument, MyListModel };
