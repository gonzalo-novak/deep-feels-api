import jwt from 'jsonwebtoken';

const createToken = (payload: any) => jwt.sign(
	payload,
	process.env.JWT_KEY as jwt.Secret,
	{
		expiresIn: '16h'
	}
);

export { createToken };