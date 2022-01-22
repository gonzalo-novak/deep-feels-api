import fs from 'fs';
import path from 'path';
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
	});

	app.get('/sounds/stream/:id', async (req, res) => {
		const { id } = req.params as { id: string };

		if(!id)
			return (
				res.status(400).json({
					ok: false,
					message: 'An id is necessary to find the wished sound'
				})
			);

		try {
			const sound = await Track.findById(id).exec();
			if(!sound) return res.status(404).json({
				ok: false,
				message: 'sound not found'
			});

			// Specifying our headers
			const filePath = path.resolve(__dirname, sound.location);
			const fileStat = fs.statSync(filePath);
			res.writeHead(200, {
				'Content-Type': 'audio/mpeg',
				'Content-Length': fileStat.size,
				'Connection': 'Keep-Alive',
				'Transfer-encoding': 'chunked',
				'Accept-Ranges': 'bytes',
			});

			console.log('Sound that will be played', id, sound);

			// Starting to stream
			const soundStream = fs.createReadStream(filePath);
			soundStream.pipe(res);
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				ok: false,
				message: 'A server error has occurred at retrieve the wished sound'
			});
		}
	});
};

export { track };