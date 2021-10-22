import { Express } from 'express';
import { Token } from '../models/Token';
import { User } from '../models/User';
import * as argon from 'argon2';
import { Schema } from 'mongoose';

const resetPassword = (app: Express) => {
	app.post('/reset-password', async (req, res) => {
		const authToken = req.get('Authorization');

		if(!authToken)
			return res.status(400).json({ ok: false, message: 'Auth is not present to continue.' })

		// Check if token exists or has been expired
		const { password, uid } = req.body;
		const passwordResetToken = await Token.findOne({ userId: uid });

		if(!passwordResetToken)
			return res.status(401).json({ ok: false, message: 'Invalid or expired token.' });

		// Comparing hashed token within received token
		const isTokenCorrect = await argon.verify(passwordResetToken.token, authToken);

		if(!isTokenCorrect)
			return res.status(401).json({ ok: false, message: 'Token does not match' })


			const newPassword = await argon.hash(password);

			try {
				await User.findOneAndUpdate({ _id: uid }, { password: newPassword });
				await passwordResetToken.deleteOne();
				return res.json({ ok: true })
			} catch (error) {
				console.error(error);
				return res.status(500).json({ ok: false, message: 'Some error has been occurred in our side. :(' })
			}
	});
};

export { resetPassword };