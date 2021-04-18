const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Text is required.']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required.']
    },
    createdOn: {
		type: Date,
		default: new Date()
	},
    userId: {
        type: String,
        required: true     
    }

})

module.exports = mongoose.model('Expense', expenseSchema);