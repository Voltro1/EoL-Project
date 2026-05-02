import cors from "cors";
import express from "express";
import {
  authenticateAccount,
  createAccount,
  deleteAccount,
  getAccountByUserId,
  parseUserId,
  updateAccountProfile,
  updateAccountPreferences,
} from "./database.mjs";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

function sanitizePhone(phone) {
  if (typeof phone !== "string") {
    return null;
  }

  const normalized = phone.replace(/\s+/g, "").trim();
  return normalized.length > 0 && normalized.length <= 10 ? normalized : null;
}

function validateSignupBody(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const phone = sanitizePhone(body.phone);
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";

  if (!name || !password || !phone) {
    return null;
  }

  return {
    name,
    password,
    phone,
    email,
    address,
  };
}

function validatePreferences(body) {
  const currency = body.currency;
  const language = body.language;
  const unit = body.unit;
  const darkMode = body.darkMode;

  const validCurrency = currency === "USD" || currency === "LBP" || currency === "EUR";
  const validLanguage = language === "EN" || language === "AR" || language === "FR";
  const validUnit = unit === "Watts" || unit === "Kilowatts" || unit === "kWh";

  if (!validCurrency || !validLanguage || !validUnit || typeof darkMode !== "boolean") {
    return null;
  }

  return { currency, language, unit, darkMode };
}

function validateProfileBody(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = sanitizePhone(body.phone);
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const profilePicture =
    typeof body.profilePicture === "string" ? body.profilePicture.trim() : "";

  if (!name || !phone) {
    return null;
  }

  if (profilePicture && !profilePicture.startsWith("data:image/")) {
    return null;
  }

  return {
    name,
    phone,
    email,
    address,
    profilePicture,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/signup", async (req, res) => {
  const payload = validateSignupBody(req.body);
  if (!payload) {
    return res.status(400).json({
      error: "Name, phone number, and password are required.",
    });
  }

  try {
    const account = await createAccount(payload);
    if (!account) {
      return res.status(500).json({ error: "Account creation failed." });
    }

    return res.status(201).json({ user: account });
  } catch (err) {
    if (err?.code === "23505") {
      return res.status(409).json({
        error: "An account with that phone number or email already exists.",
      });
    }

    console.error(err);
    return res.status(500).json({ error: "Database query failure" });
  }
});

app.post("/api/login", async (req, res) => {
  const userId = typeof req.body.userId === "string" ? req.body.userId.trim() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!userId || !password || parseUserId(userId) === null) {
    return res.status(400).json({ error: "A valid user ID and password are required." });
  }

  try {
    const account = await authenticateAccount(userId, password);
    if (!account) {
      return res.status(401).json({ error: "Invalid user ID or password." });
    }

    return res.json({ user: account });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database query failure" });
  }
});

app.get("/api/accounts/:userId", async (req, res) => {
  try {
    const account = await getAccountByUserId(req.params.userId);
    if (!account) {
      return res.status(404).json({ error: "Account not found." });
    }

    return res.json({ user: account });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database query failure" });
  }
});

app.put("/api/accounts/:userId/preferences", async (req, res) => {
  const preferences = validatePreferences(req.body);
  if (!preferences) {
    return res.status(400).json({ error: "Invalid preference payload." });
  }

  try {
    const account = await updateAccountPreferences(req.params.userId, preferences);
    if (!account) {
      return res.status(404).json({ error: "Account not found." });
    }

    return res.json({ user: account });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database query failure" });
  }
});

app.put("/api/accounts/:userId/profile", async (req, res) => {
  const profile = validateProfileBody(req.body);
  if (!profile) {
    return res.status(400).json({
      error: "Name and phone are required, and the profile picture must be a valid image.",
    });
  }

  try {
    const account = await updateAccountProfile(req.params.userId, profile);
    if (!account) {
      return res.status(404).json({ error: "Account not found." });
    }

    return res.json({ user: account });
  } catch (err) {
    if (err?.code === "23505") {
      return res.status(409).json({
        error: "That phone number or email is already in use.",
      });
    }

    console.error(err);
    return res.status(500).json({ error: "Database query failure" });
  }
});

app.delete("/api/accounts/:userId", async (req, res) => {
  try {
    const deleted = await deleteAccount(req.params.userId);
    if (!deleted) {
      return res.status(404).json({ error: "Account not found." });
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database query failure" });
  }
});

app.listen(port, () => console.log(`server running on port ${port}`));
