import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { me } from './routes/me';
import { mood } from './routes/mood';
import { pipeSync } from './utils/pipe';
import { register } from './routes/register';
import { connectDatabase } from './config/db.config';

const server = () => {
	const app = express();
	const port = process.env.PORT || 9001;
	connectDatabase();

	//Initializing middleware and routes
	app.use(cors({
		origin: '*',
		allowedHeaders: ['Content-Type', 'Authorization']
	}));
	app.use(express.json({}));

	//User Routes
	pipeSync(
		mood,
		register,
		me
	)(app);

	app.listen(port, () => {
		console.log(`App listening at http://localhost:${port}`);
	});
};

dotenv.config();
server();