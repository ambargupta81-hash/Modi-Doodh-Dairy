import { Router, type IRouter } from "express";
import nodemailer from "nodemailer";

const router: IRouter = Router();

const NOTIFY_EMAILS = ["f4710301@gmail.com", "sahusobhit51@gmail.com"];
const FROM_EMAIL = "f4710301@gmail.com";
const APP_PASS = "wgwxqkdvyhikxivw";

router.post("/", async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: FROM_EMAIL, pass: APP_PASS },
    });

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <div style="background:#d97706;color:white;padding:20px;text-align:center">
          <h1 style="margin:0">Modi Doodh Dairy</h1>
          <p style="margin:5px 0 0">Customer Support Message</p>
        </div>
        <div style="padding:24px">
          <h2 style="color:#d97706;margin-top:0">New Support Request</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;font-weight:bold;width:130px;background:#fef3c7">Name</td><td style="padding:8px;border:1px solid #eee">${name}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;background:#fef3c7">Phone</td><td style="padding:8px;border:1px solid #eee"><a href="tel:${phone}">${phone}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;background:#fef3c7">Message</td><td style="padding:8px;border:1px solid #eee;white-space:pre-wrap">${message}</td></tr>
          </table>
          <p style="margin-top:20px;color:#666;font-size:13px">Please follow up with the customer at your earliest convenience.</p>
        </div>
        <div style="background:#fef3c7;padding:12px;text-align:center;color:#92400e;font-size:12px">
          Modi Doodh Dairy | +919575364720 | f4710301@gmail.com
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Modi Doodh Dairy Support" <${FROM_EMAIL}>`,
      to: NOTIFY_EMAILS.join(", "),
      subject: `Support Request from ${name} (${phone})`,
      html,
    });

    res.json({ success: true, message: "Support message sent successfully" });
  } catch (err) {
    req.log.error(err, "Support email error");
    res.status(500).json({ error: "Failed to send support message" });
  }
});

export default router;
