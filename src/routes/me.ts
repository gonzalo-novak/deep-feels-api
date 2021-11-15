import fs from 'fs';
import path from 'path';

import { Express } from 'express';
import { authVerify } from '../middlewares/authVerify';
import { User } from '../models/User';
import { UploadedFile } from 'express-fileupload';

const me = (app: Express) => {
	app.get('/user/:id/me', authVerify, async (req, res) => {
		const { id } = req.params;
		const userDB = await User.findById(id).select('-password');

		return res.json({ok: true, user: userDB});
	});

	app.put('/user/:id/edit', authVerify, async (req, res) => {
		const { id } = req.params;
		const { email, name } = req.body as { email: string; name: string; };
		const photo = req.files?.photo as UploadedFile;

		if(!email && !name && !photo)
			return res.status(400).json({ ok: false, message: 'Payload must not be empty' });

		try {
			const userDB = await User.findById(id).select('-password');

			if(!userDB)
				return res.status(404).json({ ok: false, message: 'User does not exists.' });

			if(email)
				userDB.email = email;

			if(name)
				userDB.name = name;

			if(photo) {
				// Cleaning previously photo:
				if(userDB.photo){
					const currentPath = path.join(__dirname, '../uploads/', userDB.photo);
					if(fs.existsSync(currentPath))
						fs.unlinkSync(currentPath);
				}

				const tempName =
					userDB._id + '.' + new Date().getTime() + '.' + photo.mimetype.split('/')[1];
				const uploadPath = path.join(__dirname, '../uploads/', tempName);

				await photo.mv(uploadPath);
				userDB.photo = tempName;
			}

			// Saving changes
			const newUser = await userDB.save();
			return res.json({ ok: true, user: newUser });
		} catch(e) {
			console.error('me -> Error', e);
			return res.status(500).json({ ok: false, message: e });
		}
	});
}
export { me };