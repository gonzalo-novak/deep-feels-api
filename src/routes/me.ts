import { Express } from 'express';
import { authVerify } from '../middlewares/authVerify';
import { User } from '../models/User';

const me = (app: Express) => {
	app.get('/user/:id/me', authVerify, async (req, res) => {
		const { id } = req.params;
		const userDB = await User.findById(id).select('-password');

		return res.json({ok: true, user: userDB});
	});
}
export { me };