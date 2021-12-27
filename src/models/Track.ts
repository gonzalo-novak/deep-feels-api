import { Schema, model } from 'mongoose';

const TrackSchema = new Schema({
  name: {
		type: String,
		required: true
	},
	duration: {
		type: Number, //It will be stored as a miliseconds unit
		required: true
	},
	location: {
		type: String, // fs path where it will be stored
		required: true
	},
	image: {
		type: String, // It comes from cloudinary url
		required: true
	},
	avgColor: {
		type: String, // It's the most relevant color of the above image
		required: true
	}
});

type TTrack = {
	name: string;
	duration: number;
	location: string;
	image: string;
	avgColor: string;
};

const Track = model<TTrack>("Track", TrackSchema);

export { Track, TTrack };