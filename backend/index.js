const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

app.listen(process.env.PORT || 4000, () => {
	console.log(`API is now online on port ${ process.env.PORT || 4000 }`);
})

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))
mongoose.connect(process.env.DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})