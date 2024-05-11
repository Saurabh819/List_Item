"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyListModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define MyList schema
const MyListSchema = new mongoose_1.Schema({
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
const MyListModel = mongoose_1.default.model('MyList', MyListSchema);
exports.MyListModel = MyListModel;
