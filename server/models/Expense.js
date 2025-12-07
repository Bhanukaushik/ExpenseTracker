import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  category: { 
    type: String, 
    enum: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Salary', 'Investment', 'Other'],
    required: true 
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });


export default mongoose.model('Expense', expenseSchema);
