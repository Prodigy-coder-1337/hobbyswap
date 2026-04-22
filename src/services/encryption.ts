const SECRET = 'HobbySwapLocalCipher::MetroManila::v1';

async function getKey() {
  const rawKey = new TextEncoder().encode(SECRET.padEnd(32, '0').slice(0, 32));
  return crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string) {
  return new Uint8Array(
    atob(value)
      .split('')
      .map((char) => char.charCodeAt(0))
  );
}

export async function encryptMessage(body: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey();
  const payload = new TextEncoder().encode(body);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, payload);
  const merged = new Uint8Array(iv.length + encrypted.byteLength);
  merged.set(iv, 0);
  merged.set(new Uint8Array(encrypted), iv.length);
  return toBase64(merged);
}

export async function decryptMessage(cipherText: string) {
  if (cipherText.startsWith('plain:')) {
    return cipherText.slice(6);
  }

  try {
    const merged = fromBase64(cipherText);
    const iv = merged.slice(0, 12);
    const data = merged.slice(12);
    const key = await getKey();
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return new TextDecoder().decode(decrypted);
  } catch {
    return 'Unable to decode this message.';
  }
}
