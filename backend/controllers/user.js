const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const auth = require('../auth');
const { TokenExpiredError } = require('jsonwebtoken');
const clientId = '734331487004-nvsm4j4j4h7jo321c9v233a3hc146rfm.apps.googleusercontent.com'

module.exports.emailExists = (params) => {

	return User.find({ email: params.email }).then(result => {
		return result.length > 0 ? true : false
	})

}

module.exports.register = (params) => {

	let user = new User({
		firstName: params.firstName,
		lastName: params.lastName,
		email: params.email,
		mobileNo: params.mobileNo,
		password: bcrypt.hashSync(params.password, 10),
		loginType: 'email'
	})

	return user.save().then((user, err) => {

		return (err) ? false : true
	})

}

module.exports.login = (params) => {

	return User.findOne({ email: params.email }).then(user => {

		if(user === null) {
			return {error: 'does-not-exist'}
		}
		if (user.loginType !== 'email'){
			return {error: 'login-type-error'}
		}

		// compares the password received from the form and the hashed password
		// return true if values match, else it will return false
		const isPasswordMatched = bcrypt.compareSync(params.password, user.password);

		if (isPasswordMatched) {
			return { accessToken: auth.createAccessToken(user.toObject()) };
		} else {
			return {error: 'incorrect-password'};
		}

	})

}

module.exports.get = (params) => {

	return User.findById(params.userId).then(user => {

		user.password = undefined;
		return user;

	})

}

module.exports.verifyGoogleTokenId = async (tokenId) => {
	const client = new OAuth2Client(clientId)
	const data = await client.verifyIdToken({
		idToken: tokenId,
		audience: clientId
		//audience and idToken are required to verify if the token id is correct. if it is legitimate and is coming from a recognizable source.
		
	})
		if(data.payload.email_verified === true){
			const user = await User.findOne({email: data.payload.email}).exec();
			if(user !== null){
				if (user.loginType === "google") {
					return {accessToken: auth.createAccessToken(user.toObject())};
				} else {
					return {error: "login-type-error"}
				}
			} else {
				const newUser = new User({
					firstName: data.payload.given_name,
					lastName: data.payload.family_name,
					email: data.payload.email,
					loginType: "google"
				});
				return newUser.save().then((user, err) => {
					return {accessToken: auth.createAccessToken(user.toObject())};
				})
			}
		} else {
			return {error: "google-auth-error"}
		}
}

module.exports.update = (userId, params) => {
	const updates = {
		firstName: params.firstName,
		lastName: params.lastName,
		password: params.password
	}
	return User.findByIdAndUpdate(userId, updates).then((doc, err) => {
		return (err) ? false : true
	})
}


