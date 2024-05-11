import mongoose, { Schema, Document } from 'mongoose';

type Genre = 'Action' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Romance' | 'SciFi';

// Define interface representing user document
interface UserDocument extends Document {
  id: string;
  username: string;
  preferences: {
    favoriteGenres: Genre[];
    dislikedGenres: Genre[];
  };
  watchHistory: Array<{
    contentId: string;
    watchedOn: Date;
    rating?: number;
  }>;
}

// Define user schema
const userSchema: Schema = new Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  preferences: {
    favoriteGenres: [{ type: String }],
    dislikedGenres: [{ type: String }]
  },
  watchHistory: [{
    contentId: { type: String, required: true },
    watchedOn: { type: Date, required: true },
    rating: { type: Number }
  }]
});

// Define and export User model based on schema
 const UserModel = mongoose.model<UserDocument>('User', userSchema);

export { UserModel, UserDocument };
