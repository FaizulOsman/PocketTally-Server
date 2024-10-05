/* eslint-disable @typescript-eslint/no-inferrable-types */
import bcrypt from 'bcrypt';

function encryptPassword(
  plainPassword: string,
  saltRounds: number = 10
): string {
  return bcrypt.hashSync(plainPassword, saltRounds);
}

export { encryptPassword };
