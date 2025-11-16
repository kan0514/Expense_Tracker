import jwt, { Secret, SignOptions } from "jsonwebtoken";
import * as uuid from "uuid";
const uuidv4 = uuid.v4;
import dotenv from "dotenv";

// Import ms.StringValue type (or ensure its availability through jsonwebtoken's types)
// Note: jwt relies on the 'ms' library for expiry strings. Casting to string is often sufficient, 
// but for absolute compliance, we'll cast the options object itself.

dotenv.config();

// Define JWT_SECRET and ensure a fallback string for the Secret type.
const JWT_SECRET: Secret = process.env.JWT_SECRET || "secret";

// Define JWT_EXPIRY and ensure a fallback string.
const JWT_EXPIRY = process.env.JWT_EXPIRY || "1h";

export function signToken(payload: object): string {
  const jti = uuidv4();
  
  // FIX: Cast the options object to SignOptions. This forces the compiler 
  // to accept the string for 'expiresIn', resolving the TS2322 error.
  const options = { expiresIn: JWT_EXPIRY } as SignOptions;

  return jwt.sign(
    { ...payload, jti } as object, 
    JWT_SECRET, 
    options
  );
}

export function verifyToken(token: string) {
  try {
    // Casting JWT_SECRET to Secret ensures the correct synchronous overload for verify is used.
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (err) {
    return null;
  }
}