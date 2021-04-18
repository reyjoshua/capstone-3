const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expense');
const auth = require('../auth');

router.post('/', auth.verify, (req, res) => {
    const user = auth.decode(req.headers.authorization);
	ExpenseController.track(req.body, user.id).then(result => res.send(result));
})

router.get('/', auth.verify, (req, res) => {
    const user = auth.decode(req.headers.authorization);
    ExpenseController.getAll(user.id, req.query.startdate, req.query.enddate).then(expense => res.send(expense))
})

router.delete('/:expenseId', auth.verify, (req, res) => {
	const expenseId = req.params.expenseId
    ExpenseController.delete({ expenseId }).then(result => res.send(result)) 
})

router.get('/daily', auth.verify, (req, res) => {
    if (!req.query.startdate || !req.query.enddate) { res.status(422); res.send({
        "message": "Start Date and End Date is required fields."
    })}
    
    const user = auth.decode(req.headers.authorization);
    ExpenseController.dailyExpense(user.id, req.query.startdate, req.query.enddate).then(expense => res.send(expense))
})

router.get('/:expenseId', auth.verify, (req, res) => {
	const courseId = req.params.courseId
    ExpenseController.get({ expenseId }).then(expense => res.send(expense)) 
})

module.exports = router;