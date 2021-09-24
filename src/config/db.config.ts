import mongoose from 'mongoose';

const connectDatabase = async () => {
	if(process.env.NODE_ENV === 'staging'){
		await mongoose.connect(process.env.DB_HOST as string);
		return;
	};


	let options: mongoose.ConnectOptions = { dbName: process.env.DB_NAME || 'df-test' };
	const dbPath = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;

	if(process.env.NODE_ENV === 'development')
		options = {
			...options,
			user: process.env.DB_USER,
			pass: process.env.DB_PASSWORD
		}

	await mongoose.connect(dbPath, options);
};

export {
	connectDatabase
};