import { Express } from 'express';
import { authVerify } from '../middlewares/authVerify';

const quote = (app: Express) => {
	app.get('/quote', authVerify, async (req, res) => {
		try {
			const response = await fetch('https://type.fit/api/quotes');
			const data = await response.json();
			const quote = data[Math.floor(Math.random() * data.length)];

			return (
				res.json({ ok: true, quote })
			);
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				ok: false,
				message: 'Could not retrieve a quote'
			});
		}
	});
};

export {
	quote
};