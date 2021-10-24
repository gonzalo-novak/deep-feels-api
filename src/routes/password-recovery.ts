import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as argon2 from 'argon2';
import { Express } from 'express';
import { compile } from 'handlebars';
import { User } from '../models/User';
import { Token } from '../models/Token';
import Client from 'mailgun.js/dist/lib/client';

const passwordRecovery = (app: Express, mg: Client) => {
	app.post('/password-recovery', async (req, res) => {
		const { email }: { email: string } = req.body;

		// Verifying if user exists by their email:
		const user = await User.findOne({ email });
		if(!user) return res.json({ ok: false, message: 'User does not exists.'});

		// Verifying if exist some token before, if it is correctly, then
		// we proceed to remove:
		const currentToken = await Token.findOne({ userId: user._id });
		if(currentToken) currentToken.deleteOne();

		// Creating reset token and hashing to store it in our db:
		const resetToken = crypto.randomBytes(32).toString("hex");
		const hash = await argon2.hash(resetToken);

		const token = new Token({
			userId: user._id,
			token: hash,
			createAt: Date.now()
		});
		await token.save();

		// Generating template:
		const link = 'http://' + process.env.HOST + `/reset-password.html?token=${resetToken}?uid=${user._id}`;


		// Compiling template
		const subject = `${user.name}, you have request to recover your password`;
		const source = fs.readFileSync(path.join(__dirname, '../templates/password-recovery.hbs'), "utf8");
    const compiledTemplate = compile(source);
		// Email Settings
		const emailOpts = {
			to: email,
			from: '"Deeply 👻" <support@deepfeels.com>',
			subject,
			html: compiledTemplate({ link, name: user.name }),
		};

		// Send email
		try {
			const msg = await mg.messages.create(process.env.MAIL_DOMAIN!, emailOpts);
			if(msg) {
				return (
					res.json({
						ok: true,
						message: 'Email has been sent successfully'
					})
				);
			}
		}
		catch (e) {
			console.error(e);
			return (
				res.status(500).json({
					ok: false,
				 	message: 'An error as been ocurred in our side :('
				})
			);
		}


	});
};
export { passwordRecovery };