/**
 * Utility for hashing the admin password and encrypting/decrypting the GitHub PAT
 * so it isn't stored in plain text in localStorage.
 */

// We use the Web Crypto API
export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Derives an AES-GCM key from the password hash for encrypting the PAT
const getKeyMaterial = async (password) => {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
};

const getKey = async (keyMaterial, salt) => {
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

export const encryptPAT = async (pat, password) => {
  try {
    const keyMaterial = await getKeyMaterial(password);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await getKey(keyMaterial, salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      enc.encode(pat)
    );
    
    const encryptedArray = Array.from(new Uint8Array(encrypted));
    const saltArray = Array.from(salt);
    const ivArray = Array.from(iv);
    
    return JSON.stringify({
      salt: btoa(String.fromCharCode.apply(null, saltArray)),
      iv: btoa(String.fromCharCode.apply(null, ivArray)),
      data: btoa(String.fromCharCode.apply(null, encryptedArray))
    });
  } catch (e) {
    console.error("Encryption failed", e);
    return null;
  }
};

export const decryptPAT = async (encryptedJson, password) => {
  try {
    const parsed = JSON.parse(encryptedJson);
    const salt = new Uint8Array(atob(parsed.salt).split('').map(c => c.charCodeAt(0)));
    const iv = new Uint8Array(atob(parsed.iv).split('').map(c => c.charCodeAt(0)));
    const data = new Uint8Array(atob(parsed.data).split('').map(c => c.charCodeAt(0)));
    
    const keyMaterial = await getKeyMaterial(password);
    const key = await getKey(keyMaterial, salt);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );
    
    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (e) {
    console.error("Decryption failed", e);
    return null;
  }
};
