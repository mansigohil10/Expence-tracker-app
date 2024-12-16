const Expense = require('../models/Expense');
const csvtojson = require('csvtojson');
const fs = require('fs');
const path = require('path');


// Add expense
const addExpense = async (req, res) => {
  try {
    const { amount, category, payment_method, date } = req.body;
    const newExpense = new Expense({ amount, category, payment_method, date, user: req.user.id });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Bulk upload from CSV
const bulkUploadExpenses = async (req, res) => {
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, '../uploads', req.file.filename);
  console.log('File will be stored at:', filePath);

  try {
    const expenses = await csvtojson().fromFile(filePath);
    const expenseData = expenses.map(expense => ({
      amount: Number(expense.amount),
      category: expense.category,
      payment_method: expense.payment_method,
      date: new Date(expense.date),
      user: req.user.id,
    }));

    await Expense.insertMany(expenseData);
    console.log('Expenses uploaded successfully');
    res.status(201).json({ message: 'Expenses uploaded successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    return res.status(500).json({ message: 'Error processing file' });
  } finally {
    if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
      console.log('Temporary file deleted:', filePath);
    }
  }
};

// Read expenses with filters, sorting, and pagination
const readExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, payment_method, sortBy, page = 1, limit = 10 } = req.query;

    let query = { user: req.user.id };

    if (category) query.category = category;
    if (payment_method) query.payment_method = payment_method;
    if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const expenses = await Expense.find(query)
      .sort(sortBy ? { [sortBy]: 1 } : {})
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const expense = await Expense.findByIdAndUpdate(id, updateData, { new: true });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
    try {
      const expenseId = req.params.id;
      const expense = await Expense.findByIdAndDelete(expenseId);
  
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
  
      res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = {
  addExpense,
  bulkUploadExpenses,
  readExpenses,
  updateExpense,
  deleteExpense,
};
