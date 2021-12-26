import { Express } from 'express';
import { Track } from '../models/Track';
import { authVerify } from '../middlewares/authVerify';

const track = (app: Express) => {
	app.get('/sounds', authVerify, async (req, res) => {
		try {
			const sounds = await Track.find();
			return res.json({ ok: true, sounds });
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				ok: false,
				message: 'Server error at trying to get sounds'
			});
		}
	})
};

export { track };