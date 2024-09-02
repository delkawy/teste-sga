export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: '1d',
  hashSaltRounds: process.env.HASH_SALT_ROUNDS ?? 8,
};
