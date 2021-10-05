import { Express } from "express";
import { TUser, User } from "../models/User";
import { TMood, Mood } from "../models/Mood";
import { authVerify } from "../middlewares/authVerify";

const mood = (app: Express) => {
	app.put('/user/:id/mood', authVerify, async (req, res) => {
		const { id } = req.params;
		const { moods } = req.body as Pick<TUser, 'moods'>;

		if(!id)
			return res.status(400).json({ ok: false, message: 'user id is necessary' });

		const userDB = await User.findByIdAndUpdate(
			id,
			{ moods },
			{ new: true }
		).select('-password -email');

		return res.json({ ok:true, user: userDB });
	});

	app.get('/moods', async (_, res) => {
		const moods = await Mood.find();
		return res.json({ ok: true, moods });
	});
}

const registerMoods = async () => {
	const moodsDbLength = await Mood.count();
	const moods: TMood[] = [
		{
			name: 'Ansiedad',
			icon: 'https://res.cloudinary.com/mrrobnav/image/upload/v1633456610/deepfeels/ansiedad_mm9w5x.svg'
		},
		{
			name: 'Depresión',
			icon: 'https://res.cloudinary.com/mrrobnav/image/upload/v1633456610/deepfeels/depresion_jjme9g.svg'
		},
		{ name: 'Insomnio',
			icon: 'https://res.cloudinary.com/mrrobnav/image/upload/v1633456610/deepfeels/insomnio_laoziq.svg'
		},
		{
			name: 'Tristeza' ,
			icon: 'https://res.cloudinary.com/mrrobnav/image/upload/v1633456610/deepfeels/tristeza_pa4oo4.svg'
		}
	];

	if(moodsDbLength === moods.length)
		return console.log('moods already exists :)');

	moods.forEach(async (x) => {
		const mood = new Mood(x);
		await mood.save();
	});
}
registerMoods();

export { mood };