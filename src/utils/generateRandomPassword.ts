/* eslint-disable @typescript-eslint/no-inferrable-types */
export default function generateRandomPassword(): string {
  const characters: string =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password: string = '';

  for (let i: number = 0; i < 10; i++) {
    const randomIndex: number = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
}
