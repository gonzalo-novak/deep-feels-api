import Mailgun from "mailgun.js";
import FormData from 'form-data';
import IFormData from "mailgun.js/dist/lib/interfaces/IFormData";

const mailgunClient = () => {

	const mg =
		new Mailgun(FormData as unknown as new (...args: unknown[]) => IFormData);

	const instance = mg.client({
		username: 'monstertrap.',
		key: process.env.MAIL_PRIV_KEY!,
		public_key: process.env.MAIL_PUBLIC_KEY!
	});

	return instance;
}

export {
	mailgunClient
};