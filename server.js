require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const receiptSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  savedAt: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
});
const Receipt = mongoose.model('Receipt', receiptSchema);

// List all saved receipts
app.get('/api/receipts', async (req, res) => {
  try {
    const receipts = await Receipt.find({}, { _id: 0, __v: 0 }).sort({ savedAt: -1 });
    res.json(receipts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load receipts' });
  }
});

// Create or update (upsert) a receipt by its id
app.post('/api/receipts', async (req, res) => {
  try {
    const { id, savedAt, data } = req.body;
    if (!id || !data) return res.status(400).json({ error: 'Missing id or data' });
    await Receipt.findOneAndUpdate(
      { id },
      { id, savedAt: savedAt || new Date().toISOString(), data },
      { upsert: true, new: true }
    );
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save receipt' });
  }
});

// Delete a receipt by id
app.delete('/api/receipts/:id', async (req, res) => {
  try {
    await Receipt.deleteOne({ id: req.params.id });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete receipt' });
  }
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Polaris Resort app running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
