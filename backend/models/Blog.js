const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: 'Amal Abraham'
    },
    image: {
        type: String,
        default: '/assets/blog/default.jpg'
    },
    category: {
        type: String,
        default: 'Network Tips'
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    metaTitle: String,
    metaDescription: String,
    readingTime: Number
});

// Middleware to calculate reading time before saving
blogSchema.pre('save', function (next) {
    const wordsPerMinute = 200;
    const noOfWords = this.content.split(/\s/g).length;
    this.readingTime = Math.ceil(noOfWords / wordsPerMinute);
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
