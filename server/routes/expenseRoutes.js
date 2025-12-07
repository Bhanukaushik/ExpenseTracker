import express from 'express';
import mongoose from 'mongoose';
import Expense from '../models/Expense.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

// ---------------- Specific routes FIRST ----------------

// Search expenses
router.get('/search', async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: 'Keyword required' });
  try {
    const expenses = await Expense.find({
      userId: req.user._id,
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    }).sort({ date: -1 }).limit(20).lean();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter expenses
router.get('/filter', async (req, res) => {
  const { category, month } = req.query;
  try {
    let filter = { userId: req.user._id };
    if (category) filter.category = category;
    if (month) {
      const [year, mon] = month.split('-');
      const start = new Date(year, mon - 1, 1);
      const end = new Date(year, mon, 0);
      filter.date = { $gte: start, $lte: end };
    }
    const expenses = await Expense.find(filter).sort({ date: -1 }).limit(50).lean();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sort expenses
router.get('/sort', async (req, res) => {
  const { by = 'date' } = req.query;
  try {
    const sortOptions = {
      amount: { amount: -1 },
      date: { date: -1 },
      name: { name: 1 },
      category: { category: 1 }
    };
    const expenses = await Expense.find({ userId: req.user._id })
      .sort(sortOptions[by] || sortOptions.date).limit(50).lean();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Summary
router.get('/summary', async (req, res) => {
  try {
    const categorySummary = await Expense.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    const totalAmount = categorySummary.reduce((sum, cat) => sum + cat.total, 0);
    res.json({
      categories: categorySummary,
      totalAmount,
      expenseCount: categorySummary.reduce((sum, cat) => sum + cat.count, 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Statistics
router.get('/statistics', async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            category: '$category'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, total: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all expenses for a user
router.get('/users/:userId/expenses', async (req, res) => {
  if (req.params.userId !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const expenses = await Expense.find({ userId: req.params.userId }).sort({ date: -1 }).lean();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete all expenses
router.delete('/', async (req, res) => {
  try {
    const result = await Expense.deleteMany({ userId: req.user._id });
    res.json({ message: 'All expenses deleted', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- Generic CRUD routes AFTER ----------------

// Get all expenses (default list)
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 }).limit(50).lean();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create expense
router.post('/', async (req, res) => {
  try {
    const expense = new Expense({ ...req.body, userId: req.user._id });
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get expense by ID
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid expense ID format' });
    }
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id }).lean();
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update expense by ID
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid expense ID format' });
    }
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete expense by ID
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid expense ID format' });
    }
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
