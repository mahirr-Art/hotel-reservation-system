import { SignJWT, jwtVerify } from "jose";

const secretKey = () => new TextEncoder().encode(process.env.JWT_SECRET);

export async function createAdminToken(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as { email: string };
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE = "admin_session";