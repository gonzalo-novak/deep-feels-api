import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { me } from './routes/me';
import { mood } from './routes/mood';
import { pipeSync } from './utils/pipe';
import { register } from './routes/register';
import { connectDatabase } from './config/db.config';
import { login } from './routes/login';

const server = async () => {
	const app = express();
	const port = process.env.PORT || 9001;
	await connectDatabase();

	//Initializing middleware and routes
	app.use(cors({
		origin: '*',
		allowedHeaders: ['Content-Type', 'Authorization']
	}));
	app.use(express.json({}));

	//User Routes
	pipeSync(
		register,
		login,
		mood,
		me
	)(app);

	app.listen(port, () => {
		console.log(`App listening at http://localhost:${port}`);
	});
};

dotenv.config();
server();