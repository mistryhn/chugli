import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '@/config/env';
import { HttpError } from '@/lib/http-error';

type JwtPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

const textEncoder = new TextEncoder();

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function base64UrlDecode(value: string) {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(`${base64}${padding}`, 'base64').toString('utf8');
}

function sign(input: string) {
  return base64UrlEncode(
    createHmac('sha256', env.JWT_SECRET).update(input).digest(),
  );
}

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = textEncoder.encode(left);
  const rightBuffer = textEncoder.encode(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAccessToken(user: { id: string; email: string }) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      iat: now,
      exp: now + env.JWT_EXPIRES_IN,
    } satisfies JwtPayload),
  );
  const unsignedToken = `${header}.${payload}`;

  return `${unsignedToken}.${sign(unsignedToken)}`;
}

export function verifyAccessToken(token: string) {
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new HttpError(401, 'Invalid authentication token');
  }

  const [header, payload, signature] = parts as [string, string, string];
  const expectedSignature = sign(`${header}.${payload}`);

  if (!constantTimeEqual(signature, expectedSignature)) {
    throw new HttpError(401, 'Invalid authentication token');
  }

  let decodedPayload: JwtPayload;

  try {
    decodedPayload = JSON.parse(base64UrlDecode(payload)) as JwtPayload;
  } catch {
    throw new HttpError(401, 'Invalid authentication token');
  }

  if (!decodedPayload.sub || !decodedPayload.email || !decodedPayload.exp) {
    throw new HttpError(401, 'Invalid authentication token');
  }

  if (decodedPayload.exp <= Math.floor(Date.now() / 1000)) {
    throw new HttpError(401, 'Authentication token expired');
  }

  return decodedPayload;
}
