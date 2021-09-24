import * as argon2 from 'argon2';
import { Express } from 'express';
import { User } from '../models/User';
import { createToken } from '../utils/createToken';

const login = (app: Express) => {
	app.post('/user/login', async (req, res) => {
		const { email, password } = req.body as TUserLogin;
		const user = await User.findOne({ email });

		if(!user)
			return res.status(404).json({ ok: false, message: 'Could not find some account with that information' });

		try {
			const { password: userPassword, ...rest } = user.toObject();
			const isPasswordValid = await argon2.verify(userPassword, password);

			if(!isPasswordValid)
				return res.status(401).json({ok: false, message: 'Email or password data is incorrect, try again.'});

				const token = createToken({ user: user._id });
				return res.json({ok: true, user: rest, token})

		} catch (error) {
			console.error(error);
			return res.status(500);
		}
	});
};

type TUserLogin = {
	email: string;
	password: string;
};
export { login };