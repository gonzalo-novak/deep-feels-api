import * as argon from 'argon2';
import { User } from '../models/User';
import { Express, Response } from 'express';
import { createToken } from '../utils/createToken';
import { isEmailValid } from '../utils/isEmailValid';

const register = (app: Express) => {
	const isDataValidated = ({name, email, password}: RegisterReqBody, res: Response): boolean => {
		if(!name || !email || !password){
			res.status(400).json({ok: false, message: "Some field is missing"});
		}

		if(name.length <= 2){
			res.status(400).json({ ok: false, message: "Name length should be major than 2 characters" });
			return false;
		}

		if(!isEmailValid(email)){
			res.status(400).json({ok: false, message: "Email seems not to be correct"});
			return false;
		}


		if(password.length <= 6){
			res.status(400).json({ok: false, message: "Password characters seems to be minor than the suggested character length"});
			return false;
		}

		return true;
	}

	app.post('/user/register', async (req, res) => {
		const body: RegisterReqBody = req.body;

		if(isDataValidated(body, res)){
			const { password, name, email } = body;
			try {
				const isUserSavedPreviously = await User.findOne({email});

				if(isUserSavedPreviously)
					return res.status(400).json({ok: false, message: 'user has already exists'});

				const hash = await argon.hash(password);
				const user = new User({ name, email, password: hash });
				const document = await user.save();

				//TODO: Return User without password
				const userDB = await User.findById(document._id).select('-password -email');
				return res.status(201).json({ok: true, user: userDB, token: createToken({user: user._id})});
			} catch (error) {
				console.error(error)
				return res.status(500);
			}
		}
	})
}

export type RegisterReqBody = {
	name: string;
	email: string;
	password: string;
}

export { register };