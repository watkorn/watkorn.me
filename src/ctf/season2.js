// src/ctf/season2.js — levels 6 and 7 live in the terminal. Level 8 hides in an image, not in code.
// No flag is stored in plain text here: level 6 is AES-GCM encrypted, level 7 is XORed.

// ---- level 6 "Trust issues": a JWT-looking session cookie whose signature is never checked
const COOKIE = "yeti_session";
const b64url = (obj) => btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const GUEST = `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url({ user: "guest", role: "guest" })}.c2lnbmF0dXJlLW5vdC1jaGVja2Vk`;

export function ensureSession() {
  if (document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=`))) return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${GUEST}; path=/; max-age=31536000; SameSite=Strict${secure}`;
}

// { user, role } from the cookie, or null if it's missing or mangled
export function readSession() {
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  if (!raw) return null;
  try {
    const part = raw.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(part + "=".repeat((4 - (part.length % 4)) % 4)));
    return { user: String(payload.user || "guest"), role: String(payload.role || "guest") };
  } catch {
    return null;
  }
}

const IV = "RvBXkOtfzNVqqaIK";
const SEALED = "0fba19kiHmlYV4Z4rWg8CzkaKPQIhAF/RWg875C71ZOBpftq1ewdtme9CTALeOLID8s1";
const bytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

// /root/flag.txt, readable only when the session says role=admin
export async function readRootFlag(session) {
  if (session?.role !== "admin" || !globalThis.crypto?.subtle) return null;
  const raw = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`yeti-root:${session.role}`));
  const key = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes(IV) }, key, bytes(SEALED));
  return new TextDecoder().decode(plain);
}

// ---- level 7 "One byte": ~/.secret/vault.xor
export const VAULT_XOR =
  "2d3b2e31352834216a34690538232e6905226a28056b2905346a2e0569343928232a2e6b6a3427";
