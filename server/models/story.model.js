// models/Story.js
import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Storymedia: {
        secure_url:String,
        public_id:String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '24h' // Automatically delete the story after 24 hours
    },
    viewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]
});

const Story = mongoose.model('Story', storySchema);

export default Story;
