import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const REFERRAL_DISCOUNT = 1;

router.post("/apply", async (req, res) => {
  try {
    const { referralCode, userId } = req.body;
    if (!referralCode) {
      res.status(400).json({ error: "Referral code is required" });
      return;
    }
    const [referrer] = await db.select().from(usersTable)
      .where(eq(usersTable.referralCode, referralCode.toUpperCase()));
    if (!referrer) {
      res.status(400).json({ error: "Invalid referral code" });
      return;
    }
    if (userId && referrer.id.toString() === userId.toString()) {
      res.status(400).json({ error: "You cannot use your own referral code" });
      return;
    }
    await db.update(usersTable)
      .set({ referralBalance: (referrer.referralBalance ?? 0) + REFERRAL_DISCOUNT })
      .where(eq(usersTable.id, referrer.id));
    res.json({
      success: true,
      discount: REFERRAL_DISCOUNT,
      message: `Referral code applied! You get ₹${REFERRAL_DISCOUNT} off your order. The referrer also earns ₹${REFERRAL_DISCOUNT}.`,
    });
  } catch (err) {
    req.log.error(err, "Apply referral error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
