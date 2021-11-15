import { model, Schema, SchemaTypes } from 'mongoose';

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
	moods: {
		type: [SchemaTypes.ObjectId],
		default: []
	},
	photo: {
		type: String
	}
});

const User = model<TUser>('User', UserSchema);

type TUser = {
	photo: string;
	name: string;
	password: string;
	email: string;
	moods: string[];
}
export { User, TUser };