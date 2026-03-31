import { Router, type IRouter } from "express";
import { db, reviewsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await db.select().from(reviewsTable)
      .where(eq(reviewsTable.productId, productId))
      .orderBy(reviewsTable.createdAt);
    res.json(reviews);
  } catch (err) {
    req.log.error(err, "Get reviews error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, userName, productId, rating, comment } = req.body;
    if (!productId || !rating || !userName) {
      res.status(400).json({ error: "Product ID, rating, and user name are required" });
      return;
    }
    const [review] = await db.insert(reviewsTable).values({
      userId: userId || null,
      userName,
      productId,
      rating: Number(rating),
      comment: comment || null,
    }).returning();
    res.json(review);
  } catch (err) {
    req.log.error(err, "Create review error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
