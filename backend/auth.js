const jwt = require('jsonwebtoken');
const secret = 'CourseBookingAPI';

module.exports.createAccessToken = (user) => {

	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}

	// jwt.sign(payload, secretKey, options)
	return jwt.sign(data, secret, {})

}

module.exports.verify = (req, res, next) => {

	let token = req.headers.authorization
	

	if (typeof token !== 'undefined') {
		// used to get the token only
		// "Bearer fh327yrf72o3uy8o2u8ru2983ur28u"
		token = token.slice(7, token.length)

		// jwt.verify(token, secret, callback)
		return jwt.verify(token, secret, (err, data) => {
			 if(err) res.status(401)

			// next() it passes the request to the next middlware/callback function in the route
			return (err) ? res.send({auth: 'failed'}) : next()

		})

	} else {
		res.status(401)
		return res.send({auth: 'failed'});
	}

}

module.exports.decode = (token) => {

	if (typeof token !== 'undefined') {

		token = token.slice(7, token.length)

		return jwt.verify(token, secret, (err, data) => {

			// { complete: true } grabs both the request header and the payload
			return (err) ? null : jwt.decode(token, { complete: true }).payload

		})

	} else {
		return null
	}

}

// request{
// 	header:{}
// 	body/payload: {}
// }

// <head>
	// <meta authorization="fu3r8u298u982">
// </head>

// {
// 	id: user._id,
// 	email: user.email,
// 	isAdmin: user.isAdmin
// }

// "awefihwoi2tj892u8tu2"