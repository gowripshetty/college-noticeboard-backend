const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('YOUR_MONGODB_CONNECTION_STRING', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Notice Schema
const NoticeSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now }
});
const Notice = mongoose.model('Notice', NoticeSchema);

// API to get all notices (sorted by latest first)
app.get('/notices', async (req, res) => {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
});

// API to add a new notice
app.post('/notices', async (req, res) => {
    const newNotice = new Notice(req.body);
    await newNotice.save();
    res.send('Notice added!');
});

// API to delete old notices (more than 30 days old)
app.delete('/notices/cleanup', async (req, res) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    await Notice.deleteMany({ date: { $lt: cutoff } });
    res.send('Old notices deleted!');
});

app.listen(5000, () => console.log('Server running on port 5000'));
