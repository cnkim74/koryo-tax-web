import "server-only";
import { cookies } from "next/headers";

/**
 * 관리자 세션.
 *
 * 비밀번호는 코드에 두지 않고 `wrangler secret put ADMIN_PASSWORD` 로 등록합니다.
 * 쿠키에는 비밀번호가 아니라 만료시각에 HMAC 서명을 붙인 값만 담습니다.
 * 서명 키(ADMIN_SESSION_SECRET)가 없으면 로그인 자체가 비활성화됩니다.
 */
export const SESSION_COOKIE = "koryo_admin";
const MAX_AGE_SEC = 60 * 60 * 8; // 8시간

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** 길이와 내용이 모두 같을 때만 참. 비교 시간이 값에 따라 달라지지 않게 합니다. */
function timingSafeEqual(a: string, b: string) {
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  // 길이가 다르면 즉시 실패하되, 같은 길이 비교는 끝까지 수행합니다.
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, enc.encode(value)));
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export async function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(input, expected);
}

export async function createSessionCookie() {
  const secret = process.env.ADMIN_SESSION_SECRET!;
  const exp = String(Date.now() + MAX_AGE_SEC * 1000);
  const sig = await sign(exp, secret);
  return {
    name: SESSION_COOKIE,
    value: `${exp}.${sig}`,
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}

export async function isLoggedIn() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return false;

  const [exp, sig] = raw.split(".");
  if (!exp || !sig) return false;
  if (!Number.isFinite(Number(exp)) || Number(exp) < Date.now()) return false;

  return timingSafeEqual(sig, await sign(exp, secret));
}
