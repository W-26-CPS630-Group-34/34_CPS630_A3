const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
    id: {
        type:       Number,
        unique:     true,
        required:   true
    }, 
    src: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
    },
    answer: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
    },
    zoom: {
        type:       Number,
        unique:     false,
        required:   true
    },
    x: {
        type:       Number,
        unique:     false,
        required:   false
    },
    y: {
        type:       Number,
        unique:     false,
        required:   false
    }
})

const Crop = mongoose.model('Crop', CropSchema);
module.exports = Crop;