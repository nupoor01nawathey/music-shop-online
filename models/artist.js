const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;


const artistSchema = new Schema({
    wrapperType: {type: String},
    kind: {type: String},
    artistId: {type: Number},
    collectionId: {type: Number},
    trackId: {type: Number},
    artistName: {type: String},
    collectionName: {type: String},
    trackName: {type: String},
    collectionCensoredName: {type: String},
    trackCensoredName: {type: String},
    artistViewUrl: {type: String},
    collectionViewUrl: {type: String},
    trackViewUrl: {type: String},
    previewUrl: {type: String},
    artworkUrl30: {type: String},
    artworkUrl60: {type: String},
    artworkUrl100: {type: String},
    collectionPrice: {type: String},
    trackPrice: {type: String},
    releaseDate: {type: String},
    collectionExplicitness: {type: String},
    trackExplicitness: {type: String},
    discCount:  {type: Number},
    discNumber:  {type: Number},
    trackCount:  {type: Number},
    trackNumber:  {type: Number},
    trackTimeMillis: {type: Number},
    country: {type: String},
    currency: {type: String},
    primaryGenreName: {type: String},
    isStreamable: {type: Boolean}
});

module.exports = mongoose.model('Artist', artistSchema);