import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Express } from 'express';
import { User } from '../models/User';
import { Token } from '../models/Token';
import * as argon2 from 'argon2';
import { createTestAccount, createTransport, getTestMessageUrl } from 'nodemailer';
import { compile } from 'handlebars';

const passwordRecovery = (app: Express) => {
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
		const link = process.env.HOST + '/password-recovery';

		// Creating a test email account
		const testAccount = await createTestAccount();

		const transporter = createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: testAccount.user, // generated ethereal user
				pass: testAccount.pass, // generated ethereal password
			},
		});

		// Compiling template
		const subject = `${user.name}, you have request to recover your password`;
		const source = fs.readFileSync(path.join(__dirname, '../templates/password-recovery.hbs'), "utf8");
    const compiledTemplate = compile(source);

		const options = () => {
      return {
        from: '"Deeply 👻" <support@deepfeels.com>',
        to: email,
        subject: subject,
        html: compiledTemplate({ link, name: user.name }),
      };
    };

		// Send email
		transporter.sendMail(options(), (error, info) => {
			if (error) {
				return error;
			} else {
				console.log("Message sent: %s", info.messageId);
				// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

				// Preview only available when sending through an Ethereal account
				console.log("Preview URL: %s", getTestMessageUrl(info));

				return res.status(200).json({
					success: true,
				});
			}
		});
	});
};
export { passwordRecovery };