import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { Pool } from "pg";
import { loadEnvFile } from "./load-env.mjs";

loadEnvFile();

const scrypt = promisify(scryptCallback);

const pool = new Pool({
  connectionString: process.env.DB_KEY,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
});

pool.on("error", () => {
  console.error("Unexpected client error");
});

export function formatUserId(accountId) {
  return `UID-${accountId}`;
}

export function parseUserId(userId) {
  const normalized = userId.trim();
  const match = /^(?:UID-)?(\d+)$/.exec(normalized);
  return match ? Number(match[1]) : null;
}

function decodeProfilePicture(pictureBuffer) {
  if (!pictureBuffer) {
    return null;
  }

  const asUtf8 = pictureBuffer.toString("utf8");
  if (asUtf8.startsWith("data:image/")) {
    return asUtf8;
  }

  return `data:image/png;base64,${pictureBuffer.toString("base64")}`;
}

function mapAccountRow(row) {
  return {
    id: Number(row.a_id),
    userId: formatUserId(row.a_id),
    name: row.a_username,
    phone: row.a_phone,
    email: row.a_email,
    address: row.a_address,
    profilePicture: decodeProfilePicture(row.a_pfp),
    preferences: {
      currency: row.pref_curr,
      language: row.pref_lang,
      unit: row.pref_unit,
      darkMode: Boolean(row.pref_dark),
    },
  };
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password, storedHash) {
  const [salt, savedKey] = storedHash.split(":");
  if (!salt || !savedKey) {
    return false;
  }

  const derivedKey = await scrypt(password, salt, 64);
  const savedBuffer = Buffer.from(savedKey, "hex");

  if (savedBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(savedBuffer, derivedKey);
}

export async function createAccount(input) {
  const passwordHash = await hashPassword(input.password);
  const query = `
    INSERT INTO accounts (
      a_phone,
      a_password,
      a_username,
      a_email,
      a_address
    )
    VALUES ($1, $2, $3, $4, $5)
      RETURNING
        a_id,
        a_phone,
        a_username,
        a_email,
        a_address,
        a_pfp,
        pref_curr,
        pref_lang,
        pref_unit,
        pref_dark;
  `;

  const res = await pool.query(query, [
    input.phone,
    passwordHash,
    input.name,
    input.email?.trim() || null,
    input.address?.trim() || null,
  ]);

  return res.rows[0] ? mapAccountRow(res.rows[0]) : null;
}

export async function authenticateAccount(userId, password) {
  const accountId = parseUserId(userId);
  if (!accountId) {
    return null;
  }

  const query = `
    SELECT
      a_id,
      a_phone,
      a_password,
      a_username,
      a_email,
      a_address,
      a_pfp,
      pref_curr,
      pref_lang,
      pref_unit,
      pref_dark
    FROM accounts
    WHERE a_id = $1;
  `;

  const res = await pool.query(query, [accountId]);
  const account = res.rows[0];

  if (!account) {
    return null;
  }

  const passwordMatches = await verifyPassword(password, account.a_password);
  if (!passwordMatches) {
    return null;
  }

  return mapAccountRow(account);
}

export async function getAccountByUserId(userId) {
  const accountId = parseUserId(userId);
  if (!accountId) {
    return null;
  }

  const query = `
    SELECT
      a_id,
      a_phone,
      a_username,
      a_email,
      a_address,
      a_pfp,
      pref_curr,
      pref_lang,
      pref_unit,
      pref_dark
    FROM accounts
    WHERE a_id = $1;
  `;

  const res = await pool.query(query, [accountId]);
  return res.rows[0] ? mapAccountRow(res.rows[0]) : null;
}

export async function updateAccountPreferences(userId, preferences) {
  const accountId = parseUserId(userId);
  if (!accountId) {
    return null;
  }

  const query = `
    UPDATE accounts
    SET
      pref_curr = $2,
      pref_lang = $3,
      pref_unit = $4,
      pref_dark = $5
    WHERE a_id = $1
      RETURNING
        a_id,
        a_phone,
        a_username,
        a_email,
        a_address,
        a_pfp,
        pref_curr,
        pref_lang,
        pref_unit,
        pref_dark;
  `;

  const res = await pool.query(query, [
    accountId,
    preferences.currency,
    preferences.language,
    preferences.unit,
    preferences.darkMode,
  ]);

  return res.rows[0] ? mapAccountRow(res.rows[0]) : null;
}

export async function deleteAccount(userId) {
  const accountId = parseUserId(userId);
  if (!accountId) {
    return false;
  }

  const res = await pool.query("DELETE FROM accounts WHERE a_id = $1;", [accountId]);
  return (res.rowCount ?? 0) > 0;
}

export async function updateAccountProfile(userId, profile) {
  const accountId = parseUserId(userId);
  if (!accountId) {
    return null;
  }

  const query = `
    UPDATE accounts
    SET
      a_username = $2,
      a_phone = $3,
      a_email = $4,
      a_address = $5,
      a_pfp = $6
    WHERE a_id = $1
    RETURNING
      a_id,
      a_phone,
      a_username,
      a_email,
      a_address,
      a_pfp,
      pref_curr,
      pref_lang,
      pref_unit,
      pref_dark;
  `;

  const pictureValue = profile.profilePicture?.trim()
    ? Buffer.from(profile.profilePicture.trim(), "utf8")
    : null;

  const res = await pool.query(query, [
    accountId,
    profile.name,
    profile.phone,
    profile.email?.trim() || null,
    profile.address?.trim() || null,
    pictureValue,
  ]);

  return res.rows[0] ? mapAccountRow(res.rows[0]) : null;
}
