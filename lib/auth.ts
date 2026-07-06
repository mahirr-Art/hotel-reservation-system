import { SignJWT, jwtVerify } from "jose";

const secretKey = () => new TextEncoder().encode(process.env.JWT_SECRET);
const userSecretKey = () => new TextEncoder().encode(process.env.JWT_SECRET + "_user");

export async function createAdminToken(email: string) {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as { email: string; role: string };
  } catch {
    return null;
  }
}

export async function createUserToken(userId: string, email: string) {
  return new SignJWT({ userId, email, role: "user" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(userSecretKey());
}

export async function verifyUserToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, userSecretKey());
    return payload as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE = "admin_session";
export const USER_COOKIE = "user_session";