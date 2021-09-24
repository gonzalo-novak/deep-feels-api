import { Express } from "express";
import { authVerify } from "../middlewares/authVerify";
import { TUser, User } from "../models/User";

const mood = (app: Express) => {
	app.put('/user/:id/mood', authVerify, async (req, res) => {
		const { id } = req.params;
		const { mood } = req.body as Pick<TUser, 'mood'>;

		if(!id)
			return res.status(400).json({ ok: false, message: 'user id is necessary' });

		const userDB = await User.findByIdAndUpdate(id, { mood }, { new: true }).select('-password -email');
		return res.json({ ok:true, user: userDB });
	});
}
export { mood };