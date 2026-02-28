const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({ 
        userId: { type: String, required: true }, 
        comment: { type: String, required: true } 
    })

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        index: true
    },
    pictures: [String],
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    comments: [commentSchema]
    },
    { timestamps: true }
);

module.exports = mongoose.model('News', newsSchema);