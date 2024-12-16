const express = require('express');
const { addExpense, bulkUploadExpenses, readExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect, isAdmin } = require('../middlewares/roleMiddleware');
const upload = require('../utils/upload'); // Utility for handling file uploads

const router = express.Router();

router.post('/', protect, addExpense);  // Add a single expense
router.post('/bulk', [protect, upload.single('file')], bulkUploadExpenses); // Bulk upload via CSV
router.get('/', protect, readExpenses);  // Fetch expenses with filtering, sorting, pagination
router.patch('/:id', protect, updateExpense);  // Update a single expense
router.delete('/:id', protect, deleteExpense);  // Bulk delete expenses

module.exports = router;
