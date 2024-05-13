import mongoose, { Schema, Document } from 'mongoose';

// Define interface representing mylist document
interface MyListDocument extends Document {
  userId: string;
  mediaId: string;
  mediaType: 'movie' | 'tvshow';
}

// Define mylist schema
const MyListSchema: Schema = new Schema({
  userId: { type: String, required: true },
  mediaId: { type: Schema.Types.ObjectId, required: true },
  mediaType: { type: String, enum: ['movie', 'tvshow'], required: true }
});

const MyListModel = mongoose.model<MyListDocument>('MyList', MyListSchema);
export { MyListModel, MyListDocument };
