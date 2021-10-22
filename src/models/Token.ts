import { Schema, model } from 'mongoose';

const TokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Token will expire in 1 hour (it are expressed in seconds)
  },
});

type TToken = {
	userId: string;
	token: string;
	createAt: string;
};

const Token = model<TToken>("Token", TokenSchema);

export { Token, TToken };