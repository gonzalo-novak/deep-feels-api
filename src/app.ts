import dotenv from 'dotenv';
import express from 'express';
import { connectDatabase } from './config/db.config';

const server = () => {
	const app = express();
	const port = process.env.PORT || 9001;
	connectDatabase();

	app.get('/', (_, res) => {
		res.json({ok: true, message: 'Hello world!'});
	});

	app.listen(port, () => {
		console.log(`App listening at http://localhost:${port}`);
	});
};

dotenv.config();
server();