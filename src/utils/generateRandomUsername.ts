export default function generateRandomUsername(
  firstName: string,
  lastName: string
): string {
  // Generate a random number or string
  const randomSuffix: string = Math.random().toString(36).substring(2, 5);

  // Combine the first name, last name, and random suffix
  const username: string =
    (firstName + lastName).toLowerCase().replace(/\s+/g, '') + randomSuffix;

  return username;
}
