import { model, Schema } from 'mongoose';

const MoodSchema = new Schema<TMood>({
	name: {
		type: String,
		required: true,
		unique: true
	},
	icon: {
		type: String,
		required: true,
		unique: true
	}
});

const Mood = model<TMood>('Mood', MoodSchema);
type TMood = {
	name: string;
	icon: string;
}
export { Mood, TMood };