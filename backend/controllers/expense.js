const Expense = require('../models/Expense');

module.exports.track = (params, userId) => {

	let expense = new Expense({
		text: params.text,
        amount: params.amount,
		userId: userId
	})

	return expense.save().then((expense, err) => {

		return (err) ? false : true
	})

}

module.exports.get = (params) => {
	return Expense.findById(params.expenseId).then(expense => expense)
}

module.exports.getAll = (userId, startDate, endDate) => {
	let filter = { userId: userId };
	if (startDate && endDate) {
		console.log('testing');
		filter.createdOn = { 
			"$gte": new Date(startDate),
			"$lte": new Date(endDate)
		};
	}
	return Expense.find(filter).then(expense => expense)
}

module.exports.delete = (params) => {
	return Expense.findByIdAndDelete(params.expenseId).then(expense => expense)
}

module.exports.dailyExpense = (userId, startDate, endDate) => {
	return Expense.aggregate([
		{
			"$match": {
				"userId": { "$eq": userId },
				"createdOn": {
					"$gte": new Date(startDate),
					"$lte": new Date(endDate)
				}
			}
		},
		{
			"$group": {
				"_id": "$createdOn",
				"income": { "$sum": {
					"$cond" : [
						{ "$gte": [ "$amount", 0 ] }, "$amount", 0
					]
				}},
				"expense": { "$sum" : {
					"$cond" : [
						{ "$lt": [ "$amount", 0 ] }, "$amount", 0
					]
				}}
			}
		},
		{
			"$sort": { _id: 1 }
		}
		
	]).then(expense => expense);
}

addDays = (date, days) => {
	const toDate = new Date(date);
	toDate.setDate(toDate.getDate() + days);
	return toDate;
}