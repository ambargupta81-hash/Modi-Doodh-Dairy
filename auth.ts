import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router: IRouter = Router();

const FROM_EMAIL = "f4710301@gmail.com";
const APP_PASS = "wgwxqkdvyhikxivw";

// In-memory OTP store: phone -> { otp, expires, data }
const otpStore = new Map<string, { otp: string; expires: number; data?: any }>();

function generateReferralCode(name: string): string {
  const base = name.replace(/\s+/g, "").toUpperCase().slice(0, 4);
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${base}${random}`;
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(toEmail: string, otp: string, name: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: FROM_EMAIL, pass: APP_PASS },
    });
    await transporter.sendMail({
      from: `"Modi Doodh Dairy" <${FROM_EMAIL}>`,
      to: toEmail,
      subject: `Your OTP for Modi Doodh Dairy - ${otp}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
          <div style="background:#2d6a4f;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
            <h2 style="margin:0">Modi Doodh Dairy</h2>
          </div>
          <div style="padding:24px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:0 0 8px 8px">
            <p style="font-size:16px;color:#374151">Hello <strong>${name}</strong>,</p>
            <p style="color:#6b7280">Your one-time password (OTP) for verification is:</p>
            <div style="background:white;border:2px solid #2d6a4f;border-radius:12px;padding:20px;text-align:center;margin:20px 0">
              <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#2d6a4f">${otp}</span>
            </div>
            <p style="color:#6b7280;font-size:14px">This OTP is valid for <strong>10 minutes</strong>. Do not share this with anyone.</p>
            <p style="color:#9ca3af;font-size:12px;margin-top:16px">If you did not request this, please ignore this email.</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("OTP email error:", err);
    return false;
  }
}

// Send OTP for login (phone + email required)
router.post("/send-otp-login", async (req, res) => {
  try {
    const { phone, email } = req.body;
    if (!phone || !email) {
      res.status(400).json({ error: "Phone number and email are required" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.phone, phone));
    if (!user) {
      res.status(404).json({ error: "No account found with this phone number. Please register first." });
      return;
    }
    if (!user.email || user.email.toLowerCase() !== email.toLowerCase()) {
      res.status(400).json({ error: "Email does not match the registered email for this phone number." });
      return;
    }
    const otp = generateOTP();
    otpStore.set(`login:${phone}`, { otp, expires: Date.now() + 10 * 60 * 1000 });

    const sent = await sendOTPEmail(user.email, otp, user.name);
    if (sent) {
      const masked = user.email.replace(/(.{2})(.*)(@.*)/, (_: string, a: string, b: string, c: string) => a + "*".repeat(b.length) + c);
      res.json({ success: true, message: `OTP sent to ${masked}. Please check your inbox.` });
    } else {
      res.status(500).json({ error: "Failed to send OTP email. Please try again or contact support." });
    }
  } catch (err) {
    req.log.error(err, "Send OTP login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send OTP for registration (email required)
router.post("/send-otp-register", async (req, res) => {
  try {
    const { phone, email, name } = req.body;
    if (!phone || !email || !name) {
      res.status(400).json({ error: "Phone, email and name are required" });
      return;
    }
    // Check if phone already registered
    const existing = await db.select().from(usersTable).where(eq(usersTable.phone, phone));
    if (existing.length > 0) {
      res.status(400).json({ error: "Phone number already registered. Please login instead." });
      return;
    }
    const otp = generateOTP();
    otpStore.set(`register:${phone}`, { otp, expires: Date.now() + 10 * 60 * 1000 });
    const sent = await sendOTPEmail(email, otp, name);
    if (sent) {
      res.json({ success: true, message: `OTP sent to ${email}. Please check your inbox.` });
    } else {
      res.status(500).json({ error: "Failed to send OTP email. Please check your email address and try again." });
    }
  } catch (err) {
    req.log.error(err, "Send OTP register error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login with phone + OTP
router.post("/login", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      res.status(400).json({ error: "Phone and OTP are required" });
      return;
    }
    const stored = otpStore.get(`login:${phone}`);
    if (!stored) {
      res.status(400).json({ error: "No OTP found. Please request a new OTP." });
      return;
    }
    if (Date.now() > stored.expires) {
      otpStore.delete(`login:${phone}`);
      res.status(400).json({ error: "OTP expired. Please request a new one." });
      return;
    }
    if (stored.otp !== otp.toString()) {
      res.status(400).json({ error: "Invalid OTP. Please check and try again." });
      return;
    }
    otpStore.delete(`login:${phone}`);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.phone, phone));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const { password: _, ...safeUser } = user;
    const token = Buffer.from(`${user.id}:${user.phone}`).toString("base64");
    res.json({ user: { ...safeUser, referralBalance: safeUser.referralBalance ?? 0 }, token });
  } catch (err) {
    req.log.error(err, "Login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Register with name + phone + email + password + OTP
router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password, otp } = req.body;
    if (!name || !phone || !email || !password || !otp) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }
    const stored = otpStore.get(`register:${phone}`);
    if (!stored) {
      res.status(400).json({ error: "No OTP found. Please request a new OTP." });
      return;
    }
    if (Date.now() > stored.expires) {
      otpStore.delete(`register:${phone}`);
      res.status(400).json({ error: "OTP expired. Please request a new one." });
      return;
    }
    if (stored.otp !== otp.toString()) {
      res.status(400).json({ error: "Invalid OTP. Please check and try again." });
      return;
    }
    otpStore.delete(`register:${phone}`);

    const existing = await db.select().from(usersTable).where(eq(usersTable.phone, phone));
    if (existing.length > 0) {
      res.status(400).json({ error: "Phone number already registered" });
      return;
    }
    const referralCode = generateReferralCode(name);
    const hashedPassword = hashPassword(password);
    const [user] = await db.insert(usersTable).values({
      name,
      phone,
      email: email || null,
      password: hashedPassword,
      referralCode,
      referralBalance: 0,
    }).returning();
    const { password: _, ...safeUser } = user;
    const token = Buffer.from(`${user.id}:${user.phone}`).toString("base64");
    res.json({ user: { ...safeUser, referralBalance: safeUser.referralBalance ?? 0 }, token });
  } catch (err) {
    req.log.error(err, "Register error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [userId] = decoded.split(":");
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, parseInt(userId)));
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    const { password: _, ...safeUser } = user;
    res.json({ ...safeUser, referralBalance: safeUser.referralBalance ?? 0 });
  } catch (err) {
    req.log.error(err, "Get me error");
    res.status(401).json({ error: "Not authenticated" });
  }
});

export default router;
