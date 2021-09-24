import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		maxlength: 150
	},
	email: {
		type: String,
		required: true,
		unique: true,
		maxlength: 150
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	mood: {
		type: String,
		default: null
	}
});

const User = model<TUser>('User', UserSchema);

type TUser = {
	name: string;
	password: string;
	email: string;
	mood: string;
}
export { User, TUser };