const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const auth = require('../auth');

// /api/users/email-exists
router.post('/email-exists', (req,res) => {
	UserController.emailExists(req.body).then(result => res.send(result));
})

// Register a user
// /api/users
router.post('/', (req, res) => {
	UserController.register(req.body).then(result => res.send(result));
})

// Login
// /api/users/login
router.post('/login', (req, res) => {
	UserController.login(req.body).then(result => res.send(result));
})

// Get User Details
// /api/users/details
// router.method(route, middleware, callback)
router.get('/details', auth.verify, (req, res) => {
	const user = auth.decode(req.headers.authorization);
	UserController.get({ userId: user.id }).then(user => res.send(user));
})

router.post('/verify-google-id-token', async (req, res)=>{
	res.send(await UserController.verifyGoogleTokenId(req.body.tokenId))
})

router.put('/editProfile/:userId', auth.verify, (req, res) => {
	const userId = req.params.userId
    UserController.update(userId, req.body).then(result => res.send(result))
})


module.exports = router;

